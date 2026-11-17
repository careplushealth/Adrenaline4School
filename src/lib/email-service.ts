import db from './db';
import crypto from 'crypto';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateType: string;
  relatedEntityType?: 'order' | 'invoice' | 'reminder' | 'training' | 'contact';
  relatedEntityId?: string;
  html: string;
  attachment?: {
    filename: string;
    contentBase64: string;
    contentType?: string;
  };
}

// Helper to resolve Resend API key dynamically
function getResendClient(): Resend | null {
  let key = process.env.RESEND_API_KEY;
  if (!key) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/RESEND_API_KEY="([^"]+)"/) || content.match(/RESEND_API_KEY=([^\r\n]+)/);
        if (match) key = match[1].trim();
      }
    } catch (e) {
      // Ignore
    }
  }
  if (!key) return null;
  return new Resend(key);
}

function getSmtpTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

function getEnvVar(name: string): string | null {
  let val = process.env[name];
  if (!val) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(new RegExp(`${name}="([^"]+)"`)) || content.match(new RegExp(`${name}=([^\\r\\n]+)`));
        if (match) val = match[1].trim();
      }
    } catch (e) {
      // Ignore
    }
  }
  if (!val) return null;
  return val.trim().replace(/^["']|["']$/g, '');
}

// Gmail API OAuth 2.0 Access Token Fetcher
async function getGmailAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (data.error || !data.access_token) {
    throw new Error(`Gmail token refresh failed: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

async function createRawEmail({
  to,
  from,
  subject,
  html,
  text,
  attachment,
}: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  attachment?: { filename: string; contentBase64: string; contentType?: string };
}): Promise<string> {
  const plainText =
    text ||
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&bull;/g, '•')
      .replace(/&mdash;/g, '—')
      .replace(/&pound;/g, '£')
      .replace(/\s+/g, ' ')
      .trim();

  const mailOptions: any = {
    from,
    to,
    replyTo: from,
    subject,
    text: plainText,
    html,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        content: Buffer.from(attachment.contentBase64, 'base64'),
        contentType: attachment.contentType || 'application/pdf',
      },
    ];
  }

  const transport = nodemailer.createTransport({ streamTransport: true });
  const info: any = await transport.sendMail(mailOptions);

  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    info.message.on('data', (chunk: Buffer) => chunks.push(chunk));
    info.message.on('end', () => {
      const rawBuffer = Buffer.concat(chunks);
      const encoded = rawBuffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      resolve(encoded);
    });
    info.message.on('error', reject);
  });
}

async function sendViaGmailApi({
  to,
  subject,
  html,
  attachment,
}: {
  to: string;
  subject: string;
  html: string;
  attachment?: { filename: string; contentBase64: string; contentType?: string };
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const clientId = getEnvVar('GOOGLE_CLIENT_ID');
  const clientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');
  const refreshToken = getEnvVar('GOOGLE_REFRESH_TOKEN');
  const senderEmail = getEnvVar('GMAIL_SENDER_EMAIL') || 'adrenaline4schools@gmail.com';

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [
      !clientId && 'GOOGLE_CLIENT_ID',
      !clientSecret && 'GOOGLE_CLIENT_SECRET',
      !refreshToken && 'GOOGLE_REFRESH_TOKEN',
    ].filter(Boolean).join(', ');
    return {
      success: false,
      error: `Missing Google OAuth credentials on host: ${missing}. Please set in deployment environment variables.`,
    };
  }

  try {
    const accessToken = await getGmailAccessToken(clientId, clientSecret, refreshToken);
    const raw = await createRawEmail({
      to,
      from: `Adrenaline4Schools <${senderEmail}>`,
      subject,
      html,
      attachment,
    });

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    const data = await res.json();
    if (data.id) {
      console.log(`[Gmail API Success] Dispatched email ID: ${data.id} to ${to}`);
      return { success: true, id: data.id };
    }
    const errText = data.error?.message || JSON.stringify(data);
    console.error('[Gmail API Error Response]', data);
    return { success: false, error: `Gmail API error: ${errText}` };
  } catch (err: any) {
    console.error('[Gmail API Exception]', err.message);
    return { success: false, error: `Gmail API Exception: ${err.message}` };
  }
}

export async function sendEmail({
  to,
  subject,
  templateType,
  relatedEntityType,
  relatedEntityId,
  html,
  attachment,
}: SendEmailOptions): Promise<{ success: boolean; id: string; provider?: string }> {
  const id = `email-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const fromAddress = process.env.EMAIL_FROM || 'Adrenaline4Schools <onboarding@resend.dev>';
  const cleanTo = to.trim().toLowerCase();

  let providerUsed = 'database_simulated';
  let deliveryStatus = 'pending';
  let errorDetail: string | null = null;

  try {
    // 1. Try Gmail API (Priority 1 if Google OAuth is authorized)
    const gmailResult = await sendViaGmailApi({ to: cleanTo, subject, html, attachment });
    if (gmailResult.success) {
      providerUsed = 'gmail_api';
      deliveryStatus = 'sent';
    } else {
      errorDetail = gmailResult.error || null;
      console.warn('[Gmail API Notice]', gmailResult.error);
      // 2. Try Resend if configured
      const resend = getResendClient();
      if (resend) {
        try {
          const { data, error } = await resend.emails.send({
            from: fromAddress,
            to: [cleanTo],
            subject,
            html,
          });
          if (error) {
            console.error('[Resend Error]', error);
            deliveryStatus = 'failed_provider';
          } else {
            providerUsed = 'resend';
            console.log(`[Resend Success] Email sent ID: ${data?.id} to ${cleanTo}`);
          }
        } catch (err: any) {
          console.error('[Resend Exception]', err);
          deliveryStatus = 'failed_provider';
        }
      } 
      // 3. Otherwise try SMTP transporter if configured
      else {
        const transporter = getSmtpTransporter();
        if (transporter) {
          try {
            await transporter.sendMail({
              from: fromAddress,
              to: cleanTo,
              subject,
              html,
            });
            providerUsed = 'smtp';
          } catch (err: any) {
            console.error('[SMTP Exception]', err);
            deliveryStatus = 'failed_provider';
          }
        }
      }
    }

    // 3. Always log to Neon database email_logs with error_detail
    const stmt = db.prepare(`
      INSERT INTO email_logs (
        id, recipient_email, subject, template_type, related_entity_type, related_entity_id, status, error_detail, body_html
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(id, cleanTo, subject, templateType, relatedEntityType || null, relatedEntityId || null, deliveryStatus, errorDetail, html);

    console.log(`[EMAIL DISPATCHED] To: ${cleanTo} | Subject: ${subject} | Provider: ${providerUsed} | Status: ${deliveryStatus}`);
    return { success: deliveryStatus === 'sent', id, provider: providerUsed };
  } catch (error: any) {
    console.error('Error logging/dispatching email:', error);
    return { success: false, id, provider: 'error' };
  }
}

/**
 * Send official 6-digit School Portal Verification Code
 */
export async function sendVerificationEmail({
  to,
  code,
  schoolName,
}: {
  to: string;
  code: string;
  schoolName: string;
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #09653d; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">Adrenaline4Schools</h1>
        <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">School Emergency Allergy & Medical Stock Portal</p>
      </div>

      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; color: #0f172a; margin-top: 0; font-weight: 700;">Verify Your School Portal Account</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Thank you for registering <strong>${schoolName}</strong> on the Adrenaline4Schools Medical Stock Portal.
        </p>

        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Please enter the following 6-digit security code into your portal verification screen to activate your account:
        </p>

        <div style="margin: 28px 0; text-align: center;">
          <div style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #107c41; border-radius: 8px; padding: 16px 36px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #09653d; font-family: monospace;">
              ${code}
            </span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Valid for 24 hours. Do not share this code.</p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #107c41; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #334155;">
          <strong>Why is this required?</strong><br/>
          In compliance with UK statutory guidance on medicines in schools and GPhC dispensing standards, all portal users must verify their school email domain.
        </div>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
        <p style="margin: 0;">Adrenaline4Schools Ltd &bull; GPhC Registered Pharmacy Partner &bull; School Emergency Medical Supply</p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Your Adrenaline4Schools Verification Code: ${code}`,
    templateType: 'email_verification',
    html,
  });
}

/**
 * Send Password Reset Code
 */
export async function sendPasswordResetEmail({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #09653d; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Adrenaline4Schools</h1>
        <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">School Security Management</p>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Password Reset Request</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          A password reset was requested for your school portal account. Use the security code below to reset your password:
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <div style="display: inline-block; background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 14px 32px;">
            <span style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #0f172a; font-family: monospace;">
              ${code}
            </span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Code expires in 60 minutes.</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Adrenaline4Schools Password Reset Code: ${code}`,
    templateType: 'password_reset',
    html,
  });
}

/**
 * Send Order & Invoice Confirmation Email
 */
export async function sendOrderConfirmationEmail({
  to,
  orderReference,
  schoolName,
  total,
  paymentMethod,
}: {
  to: string;
  orderReference: string;
  schoolName: string;
  total: number;
  paymentMethod: string;
}) {
  const isInvoice = paymentMethod.includes('bacs') || paymentMethod.includes('invoice');
  const paymentBadge = isInvoice
    ? '30-Day Official School Invoice (BACS)'
    : 'Paid Online via Stripe (Card Payment)';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #09653d; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Adrenaline4Schools</h1>
        <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">GPhC Registered Pharmacy Dispensing</p>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Order Confirmation &mdash; Ref: ${orderReference}</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Thank you for your order for <strong>${schoolName}</strong>. Your school emergency adrenaline supply request has been received by our pharmacy dispensing team.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Order Reference:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${orderReference}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>School:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${schoolName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Payment Method:</strong></td>
              <td style="padding: 6px 0; color: #09653d; font-weight: 600;">${paymentBadge}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Order Total:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700; font-size: 15px;">&pound;${total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #475569; line-height: 1.6;">
          All devices will be dispatched via tracked temperature-controlled cold-chain medical courier with maximum expiry dating and automatic batch logging.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
        <p style="margin: 0;">Adrenaline4Schools Ltd &bull; Registered Dispensing Pharmacy</p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmed: ${orderReference} - Adrenaline4Schools`,
    templateType: 'order_confirmation',
    html,
  });
}

/**
 * Send Order Notification to Admin / Operations Team (Adrenaline4schools@gmail.com)
 */
export async function sendAdminOrderNotification({
  orderReference,
  schoolName,
  urn,
  total,
  paymentMethod,
  contactName,
  contactEmail,
  contactPhone,
  items,
}: {
  orderReference: string;
  schoolName: string;
  urn?: string;
  total: number;
  paymentMethod: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  items?: Array<{ name?: string; strength?: string; quantity: number }>;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'adrenaline4schools@gmail.com';
  const isInvoice = paymentMethod.includes('bacs') || paymentMethod.includes('invoice');

  const itemsListHtml = items && items.length > 0
    ? items.map(i => `<li><strong>${i.quantity}x</strong> ${i.name || 'Adrenaline Auto-Injector'} (${i.strength || ''})</li>`).join('')
    : '<li>Auto-injector supplies</li>';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #09653d; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">New School Order Received</h1>
        <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">Adrenaline4Schools Operations Notification</p>
      </div>

      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Order Reference: ${orderReference}</h2>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          A new school emergency adrenaline order has been successfully placed on the website:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 35%;"><strong>School Name:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${schoolName} ${urn ? `(URN: ${urn})` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Contact Person:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${contactName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Contact Email:</strong></td>
              <td style="padding: 6px 0; color: #09653d; font-weight: 600;"><a href="mailto:${contactEmail}" style="color: #09653d;">${contactEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td>
              <td style="padding: 6px 0; color: #0f172a;">${contactPhone || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Payment Method:</strong></td>
              <td style="padding: 6px 0; color: #09653d; font-weight: 600;">${isInvoice ? '30-Day BACS School Invoice' : 'Card Payment (Stripe)'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Total (inc VAT):</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700; font-size: 15px;">&pound;${total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <h3 style="font-size: 14px; color: #0f172a; margin-bottom: 8px;">Ordered Auto-Injectors:</h3>
        <ul style="font-size: 13px; color: #334155; line-height: 1.8; margin-top: 0; padding-left: 20px;">
          ${itemsListHtml}
        </ul>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          Please log into the Admin Portal to review the Headteacher Requisition and approve pharmacy courier dispatch.
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `[New Order] ${schoolName} - Ref: ${orderReference} (£${total.toFixed(2)})`,
    templateType: 'admin_order_notification',
    html,
  });
}

export function generateExpiryReminderEmail({
  contactName,
  schoolName,
  productName,
  strength,
  batchNumber,
  expiryDate,
  monthsRemaining,
  reorderToken,
}: {
  contactName: string;
  schoolName: string;
  productName: string;
  strength: string;
  batchNumber: string;
  expiryDate: string;
  monthsRemaining: number;
  reorderToken: string;
}) {
  const reorderUrl = `http://localhost:3000/reorder/${reorderToken}`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #09653d; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">Adrenaline4Schools</h1>
        <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">School Emergency Allergy Stock & Expiry Management</p>
      </div>
      
      <div style="padding: 28px 24px;">
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
          <strong style="color: #92400e; font-size: 14px;">Urgent Stock Reminder: ${monthsRemaining} Month(s) Remaining Until Expiry</strong>
        </div>

        <p style="font-size: 15px; color: #1e293b; line-height: 1.6; margin-top: 0;">
          Dear <strong>${contactName}</strong>,
        </p>

        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Our registered pharmacy stock management records show that emergency adrenaline auto-injectors supplied to <strong>${schoolName}</strong> are approaching their recorded expiration date.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 40%;"><strong>Product:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${productName} (${strength})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Recorded Batch:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${batchNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Expiry Date:</strong></td>
              <td style="padding: 6px 0; color: #dc2626; font-weight: 700;">${expiryDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Supply Location:</strong></td>
              <td style="padding: 6px 0; color: #0f172a;">${schoolName}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Under UK Department of Health Guidance and statutory school allergy standards (Benedict's Law), emergency adrenaline auto-injectors must remain in-date, with clear adrenaline liquid and unbroken safety seals.
        </p>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${reorderUrl}" style="background-color: #09653d; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
            Review School Stock & Pre-Filled Reorder &rarr;
          </a>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
          <strong>Secure Reorder Link:</strong> Clicking the link above will open your school's dedicated pre-filled order portal. You can confirm or adjust quantities, select 30-Day BACS School Invoice or Card, and generate the required Headteacher Requisition.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 18px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5;">
        <p style="margin: 0 0 6px 0;">Adrenaline4Schools Ltd | Partnered with GPhC Registered Dispensing Pharmacy</p>
        <p style="margin: 0;">Automated Expiry Notifications are provided to assist school staff in stock rotation. Please continue your routine physical inspections of auto-injectors.</p>
      </div>
    </div>
  `;
}

/**
 * Send Official Invoice directly to school contact or finance department
 */
export async function sendOfficialInvoiceEmail({
  to,
  invoiceNumber,
  orderReference,
  schoolName,
  subtotal,
  vatAmount,
  totalAmount,
  poNumber,
  dueDate,
  bacsSortCode = '20-45-45',
  bacsAccountNumber = '83920184',
  bacsReference,
  customNotes,
  pdfBase64,
}: {
  to: string;
  invoiceNumber: string;
  orderReference: string;
  schoolName: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  poNumber?: string;
  dueDate: string;
  bacsSortCode?: string;
  bacsAccountNumber?: string;
  bacsReference?: string;
  customNotes?: string;
  pdfBase64?: string;
}) {
  const effectiveRef = bacsReference || invoiceNumber;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #09653d; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Adrenaline4Schools</h1>
        <p style="color: #dcfce7; margin: 4px 0 0 0; font-size: 13px;">Official Educational & Pharmacy Supply Invoice</p>
      </div>

      <div style="padding: 28px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
          <h2 style="font-size: 20px; color: #0f172a; margin: 0; font-weight: 700;">INVOICE: ${invoiceNumber}</h2>
          <span style="font-size: 12px; color: #64748b;">Order Ref: <strong>${orderReference}</strong></span>
        </div>

        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Dear Finance / School Administration Team at <strong>${schoolName}</strong>,
        </p>
        <p style="font-size: 14px; color: #334155; line-height: 1.6;">
          Please find attached the official 30-day VAT invoice for your emergency adrenaline auto-injector supply order.
        </p>

        <!-- Invoice Breakdown Table -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Invoice Number:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${invoiceNumber}</td>
            </tr>
            ${poNumber ? `
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>School PO Number:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${poNumber}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Due Date (30 Days):</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${dueDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Subtotal (ex VAT):</strong></td>
              <td style="padding: 6px 0; color: #0f172a;">&pound;${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>VAT (20%):</strong></td>
              <td style="padding: 6px 0; color: #0f172a;">&pound;${vatAmount.toFixed(2)}</td>
            </tr>
            <tr style="border-top: 1px solid #cbd5e1;">
              <td style="padding: 8px 0; color: #09653d; font-size: 15px; font-weight: 700;"><strong>Total Due:</strong></td>
              <td style="padding: 8px 0; color: #09653d; font-size: 16px; font-weight: 800;">&pound;${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- BACS Payment Instructions Box -->
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="font-size: 13px; color: #166534; margin: 0 0 10px 0; font-weight: 700; text-transform: uppercase;">BACS Bank Remittance Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 4px 0; color: #166534; width: 45%;"><strong>Bank Name:</strong></td>
              <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Barclays Commercial Bank UK</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #166534;"><strong>Account Name:</strong></td>
              <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">Adrenaline4Schools Ltd</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #166534;"><strong>Sort Code:</strong></td>
              <td style="padding: 4px 0; color: #0f172a; font-family: monospace; font-size: 14px; font-weight: 700;">${bacsSortCode}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #166534;"><strong>Account Number:</strong></td>
              <td style="padding: 4px 0; color: #0f172a; font-family: monospace; font-size: 14px; font-weight: 700;">${bacsAccountNumber}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #166534;"><strong>Payment Reference:</strong></td>
              <td style="padding: 4px 0; color: #dc2626; font-family: monospace; font-size: 14px; font-weight: 700;">${effectiveRef}</td>
            </tr>
          </table>
          <p style="font-size: 11px; color: #15803d; margin: 8px 0 0 0;">
            Please quote <strong>${effectiveRef}</strong> on your BACS payment transfer to ensure instant automated reconciliation.
          </p>
        </div>

        ${customNotes ? `
        <div style="background-color: #f8fafc; border-left: 3px solid #09653d; padding: 12px 14px; font-size: 12px; color: #475569; margin-bottom: 20px;">
          <strong>Finance Note:</strong> ${customNotes}
        </div>` : ''}

        <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
          If you require any vendor setup paperwork, proof of pharmacy registration, or custom supplier statements, please reply directly to this email or call 0161 973 3552.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
        <p style="margin: 0 0 4px 0;"><strong>Adrenaline4Schools Ltd</strong> &bull; Company Reg: 14892014 &bull; VAT Reg: GB 491 0284 12</p>
        <p style="margin: 0;">Partnered GPhC Registered Pharmacy &bull; Terms: Strictly 30 days from date of invoice.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Invoice ${invoiceNumber} for ${schoolName} (Order Ref: ${orderReference})`,
    templateType: 'invoice_dispatched',
    relatedEntityType: 'invoice',
    relatedEntityId: invoiceNumber,
    html,
    attachment: pdfBase64
      ? {
          filename: `${invoiceNumber}.pdf`,
          contentBase64: pdfBase64,
          contentType: 'application/pdf',
        }
      : undefined,
  });
}
