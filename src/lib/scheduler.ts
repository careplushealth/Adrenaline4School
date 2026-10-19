import db from './db';
import { sendEmail, generateExpiryReminderEmail } from './email-service';
import crypto from 'crypto';

export interface SchedulerResult {
  processed: number;
  sent: number;
  failed: number;
  details: Array<{
    supplyId: string;
    schoolName: string;
    productName: string;
    status: string;
    recipient: string;
  }>;
}

/**
 * Executes the automated expiry reminder sweep.
 * Idempotent: checks for pending reminders where scheduled_date <= today.
 * Prevents duplicates by verifying status = 'pending'.
 */
export function runExpiryReminderSweep(): SchedulerResult {
  const today = new Date().toISOString().split('T')[0];

  // Find due reminders
  const dueReminders = db.prepare(`
    SELECT 
      r.id as reminder_id,
      r.supply_record_id,
      r.interval_months,
      r.scheduled_date,
      r.recipient_email,
      r.reorder_token,
      s.name as school_name,
      s.headteacher_name,
      sup.batch_number,
      sup.expiry_date,
      p.name as product_name,
      p.strength
    FROM expiry_reminders r
    JOIN school_supply_records sup ON r.supply_record_id = sup.id
    JOIN schools s ON r.school_id = s.id
    JOIN products p ON sup.product_id = p.id
    WHERE r.status = 'pending' AND r.scheduled_date <= ?
      AND sup.status != 'replaced'
  `).all(today) as any[];

  let sent = 0;
  let failed = 0;
  const details = [];

  for (const rem of dueReminders) {
    try {
      // Ensure token exists
      let token = rem.reorder_token;
      if (!token) {
        token = `reorder-${crypto.randomBytes(12).toString('hex')}`;
        db.prepare('UPDATE expiry_reminders SET reorder_token = ? WHERE id = ?').run(token, rem.reminder_id);
        db.prepare('UPDATE school_supply_records SET reorder_token = ? WHERE id = ?').run(token, rem.supply_record_id);
      }

      const emailHtml = generateExpiryReminderEmail({
        contactName: rem.headteacher_name || 'School Allergy Coordinator',
        schoolName: rem.school_name,
        productName: rem.product_name,
        strength: rem.strength,
        batchNumber: rem.batch_number,
        expiryDate: rem.expiry_date,
        monthsRemaining: rem.interval_months,
        reorderToken: token,
      });

      const emailResult = sendEmail({
        to: rem.recipient_email,
        subject: `[ACTION REQUIRED] Emergency Adrenaline Expiry Notice: ${rem.school_name} (${rem.interval_months} Month Reminder)`,
        templateType: 'expiry_reminder',
        relatedEntityType: 'reminder',
        relatedEntityId: rem.reminder_id,
        html: emailHtml,
      });

      if (emailResult.success) {
        db.prepare(`
          UPDATE expiry_reminders 
          SET status = 'sent', sent_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(rem.reminder_id);

        db.prepare(`
          UPDATE school_supply_records 
          SET status = 'approaching_expiry' 
          WHERE id = ? AND status = 'active'
        `).run(rem.supply_record_id);

        sent++;
        details.push({
          supplyId: rem.supply_record_id,
          schoolName: rem.school_name,
          productName: rem.product_name,
          status: 'sent',
          recipient: rem.recipient_email,
        });
      } else {
        failed++;
        db.prepare(`
          UPDATE expiry_reminders 
          SET status = 'failed', error_message = 'Failed to deliver email' 
          WHERE id = ?
        `).run(rem.reminder_id);
      }
    } catch (err: any) {
      failed++;
      console.error('Error processing reminder:', err);
    }
  }

  // Record audit log
  if (dueReminders.length > 0) {
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `audit-rem-${Date.now()}`,
      'system-scheduler',
      'Automated Background Scheduler',
      'RUN_REMINDER_SWEEP',
      'reminders',
      'batch-sweep',
      `Processed ${dueReminders.length} due reminders: ${sent} sent, ${failed} failed.`
    );
  }

  return {
    processed: dueReminders.length,
    sent,
    failed,
    details,
  };
}

/**
 * Manually trigger an immediate reminder email for an individual supply record.
 */
export function sendManualReminder(supplyId: string): { success: boolean; message: string } {
  const supply = db.prepare(`
    SELECT 
      sup.id,
      sup.batch_number,
      sup.expiry_date,
      sup.school_id,
      sup.reorder_token,
      s.name as school_name,
      s.headteacher_name,
      s.headteacher_email,
      p.name as product_name,
      p.strength
    FROM school_supply_records sup
    JOIN schools s ON sup.school_id = s.id
    JOIN products p ON sup.product_id = p.id
    WHERE sup.id = ?
  `).get(supplyId) as any;

  if (!supply) {
    return { success: false, message: 'Supply record not found' };
  }

  let token = supply.reorder_token;
  if (!token) {
    token = `reorder-${crypto.randomBytes(12).toString('hex')}`;
    db.prepare('UPDATE school_supply_records SET reorder_token = ? WHERE id = ?').run(token, supply.id);
  }

  // Calculate approximate months remaining
  const exp = new Date(supply.expiry_date).getTime();
  const now = new Date().getTime();
  const monthsRemaining = Math.max(1, Math.round((exp - now) / (1000 * 60 * 60 * 24 * 30.5)));

  const emailHtml = generateExpiryReminderEmail({
    contactName: supply.headteacher_name,
    schoolName: supply.school_name,
    productName: supply.product_name,
    strength: supply.strength,
    batchNumber: supply.batch_number,
    expiryDate: supply.expiry_date,
    monthsRemaining,
    reorderToken: token,
  });

  const emailResult = sendEmail({
    to: supply.headteacher_email,
    subject: `[MANUAL EXPIRY NOTICE] ${supply.school_name} - Emergency Auto-Injector Expiry Alert`,
    templateType: 'manual_expiry_reminder',
    relatedEntityType: 'reminder',
    relatedEntityId: supply.id,
    html: emailHtml,
  });

  return {
    success: emailResult.success,
    message: emailResult.success ? `Reminder sent successfully to ${supply.headteacher_email}` : 'Failed to send email',
  };
}
