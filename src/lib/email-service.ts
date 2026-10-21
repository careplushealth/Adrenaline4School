import db from './db';
import crypto from 'crypto';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateType: string;
  relatedEntityType?: 'order' | 'invoice' | 'reminder' | 'training' | 'contact';
  relatedEntityId?: string;
  html: string;
}

// Lazy-initialised email clients
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

export async function sendEmail({
  to,
  subject,
  templateType,
  relatedEntityType,
  relatedEntityId,
  html,
}: SendEmailOptions): Promise<{ success: boolean; id: string; provider?: string }> {
  const id = `email-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const fromAddress = process.env.EMAIL_FROM || 'Adrenaline4Schools <notifications@adrenaline4schools.co.uk>';

  let providerUsed = 'database_simulated';
  let deliveryStatus = 'sent';

  try {
    // 1. Try Resend if configured
    if (resend) {
      try {
        const { error } = await resend.emails.send({
          from: fromAddress,
          to: [to],
          subject,
          html,
        });
        if (error) {
          console.error('[Resend Error]', error);
          deliveryStatus = 'failed_provider';
        } else {
          providerUsed = 'resend';
        }
      } catch (err: any) {
        console.error('[Resend Exception]', err);
        deliveryStatus = 'failed_provider';
      }
    } 
    // 2. Otherwise try SMTP transporter if configured
    else {
      const transporter = getSmtpTransporter();
      if (transporter) {
        try {
          await transporter.sendMail({
            from: fromAddress,
            to,
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

    // 3. Always log to Neon database email_logs
    const stmt = db.prepare(`
      INSERT INTO email_logs (
        id, recipient_email, subject, template_type, related_entity_type, related_entity_id, status, body_html
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await stmt.run(id, to, subject, templateType, relatedEntityType || null, relatedEntityId || null, deliveryStatus, html);

    console.log(`[EMAIL DISPATCHED] To: ${to} | Subject: ${subject} | Provider: ${providerUsed} | Status: ${deliveryStatus}`);
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
      <div style="background-color: #0f766e; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">Adrenaline4Schools</h1>
        <p style="color: #ccfbf1; margin: 4px 0 0 0; font-size: 13px;">Official NHS & DfE School Allergy Compliance Portal</p>
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
          <div style="display: inline-block; background-color: #f0fdfa; border: 2px dashed #0d9488; border-radius: 8px; padding: 16px 36px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f766e; font-family: monospace;">
              ${code}
            </span>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Valid for 24 hours. Do not share this code.</p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #334155;">
          <strong>Why is this required?</strong><br/>
          In compliance with UK statutory guidance on medicines in schools and GPhC dispensing standards, all portal users must verify their school institutional domain.
        </div>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
        <p style="margin: 0;">Adrenaline4Schools Ltd &bull; GPhC Registered Pharmacy Partner &bull; Official UK DfE School Supplier</p>
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
      <div style="background-color: #0f766e; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Adrenaline4Schools</h1>
        <p style="color: #ccfbf1; margin: 4px 0 0 0; font-size: 13px;">School Security Management</p>
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
    : 'Paid Online via Stripe (Card / Apple Pay)';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f766e; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Adrenaline4Schools</h1>
        <p style="color: #ccfbf1; margin: 4px 0 0 0; font-size: 13px;">GPhC Registered Pharmacy Dispensing</p>
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
              <td style="padding: 6px 0; color: #0f766e; font-weight: 600;">${paymentBadge}</td>
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
      <div style="background-color: #0f766e; padding: 24px; text-align: left;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">Adrenaline4Schools</h1>
        <p style="color: #ccfbf1; margin: 4px 0 0 0; font-size: 13px;">School Emergency Allergy Stock & Expiry Management</p>
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
          <a href="${reorderUrl}" style="background-color: #0f766e; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
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
