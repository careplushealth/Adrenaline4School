import db from './db';
import crypto from 'crypto';

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateType: string;
  relatedEntityType?: 'order' | 'invoice' | 'reminder' | 'training' | 'contact';
  relatedEntityId?: string;
  html: string;
}

export function sendEmail({
  to,
  subject,
  templateType,
  relatedEntityType,
  relatedEntityId,
  html,
}: SendEmailOptions): { success: boolean; id: string } {
  const id = `email-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

  try {
    const stmt = db.prepare(`
      INSERT INTO email_logs (
        id, recipient_email, subject, template_type, related_entity_type, related_entity_id, status, body_html
      ) VALUES (?, ?, ?, ?, ?, ?, 'sent', ?)
    `);

    stmt.run(id, to, subject, templateType, relatedEntityType || null, relatedEntityId || null, html);

    console.log(`[EMAIL DISPATCHED] To: ${to} | Subject: ${subject} | Template: ${templateType}`);
    return { success: true, id };
  } catch (error: any) {
    console.error('Error logging email dispatch:', error);
    return { success: false, id };
  }
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
