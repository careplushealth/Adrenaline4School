export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { runExpiryReminderSweep, sendManualReminder } from '@/lib/scheduler';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'all', '12m', '6m', '3m', '1m', 'expired'

    const supplies = await db.prepare(`
      SELECT 
        sup.*,
        s.name as school_name,
        s.headteacher_name,
        s.headteacher_email,
        p.name as product_name,
        p.strength,
        o.order_reference,
        (julianday(sup.expiry_date) - julianday('now')) as days_remaining
      FROM school_supply_records sup
      JOIN schools s ON sup.school_id = s.id
      JOIN products p ON sup.product_id = p.id
      JOIN orders o ON sup.order_id = o.id
      ORDER BY sup.expiry_date ASC
    `).all() as any[];

    // Fetch reminders and logs
    const reminders = await db.prepare(`
      SELECT 
        r.*,
        s.name as school_name,
        p.name as product_name,
        sup.batch_number,
        sup.expiry_date
      FROM expiry_reminders r
      JOIN schools s ON r.school_id = s.id
      JOIN school_supply_records sup ON r.supply_record_id = sup.id
      JOIN products p ON sup.product_id = p.id
      ORDER BY r.scheduled_date ASC
    `).all();

    const emailLogs = await db.prepare(`
      SELECT * FROM email_logs 
      WHERE template_type LIKE '%expiry%' OR template_type LIKE '%reminder%'
      ORDER BY sent_at DESC LIMIT 50
    `).all();

    return NextResponse.json({
      success: true,
      supplies: supplies.map((s) => ({
        ...s,
        days_remaining: Math.round(s.days_remaining),
      })),
      reminders,
      emailLogs,
    });
  } catch (error: any) {
    console.error('API GET /reminders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, supplyId, reminderId, newDate } = body;

    if (action === 'trigger_sweep') {
      const result = await runExpiryReminderSweep();
      return NextResponse.json({
        success: true,
        message: `Scheduler completed: ${result.sent} emails sent, ${result.failed} failed out of ${result.processed} due reminders.`,
        result,
      });
    }

    if (action === 'send_manual' && supplyId) {
      const result = await sendManualReminder(supplyId);
      return NextResponse.json(result);
    }

    if (action === 'reschedule' && reminderId && newDate) {
      await db.prepare(`
        UPDATE expiry_reminders 
        SET scheduled_date = ?, status = 'pending', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newDate, reminderId);

      return NextResponse.json({ success: true, message: 'Reminder rescheduled successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API POST /reminders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
