export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        inv.*,
        o.order_reference,
        s.name as school_name,
        s.headteacher_name,
        org.name as organisation_name
      FROM invoices inv
      JOIN orders o ON inv.order_id = o.id
      JOIN schools s ON inv.school_id = s.id
      JOIN organisations org ON inv.organisation_id = org.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND inv.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (inv.invoice_number LIKE ? OR o.order_reference LIKE ? OR s.name LIKE ? OR inv.po_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY inv.issue_date DESC';

    const invoices = await db.prepare(query).all(...params);
    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    console.error('API GET /invoices error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      invoiceId,
      action, // 'record_payment', 'mark_paid', 'send_reminder', 'cancel'
      amount,
      paymentMethod = 'bacs_transfer',
      reference,
      notes,
      adminUserName = 'Finance Admin',
    } = body;

    const invoice = await db.prepare('SELECT * FROM invoices WHERE id = ? OR invoice_number = ?').get(invoiceId, invoiceId) as any;
    if (!invoice) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    await db.transaction(async () => {
      if (action === 'record_payment' || action === 'mark_paid') {
        const paymentAmount = amount !== undefined ? parseFloat(amount) : invoice.total_amount;
        const newAmountPaid = invoice.amount_paid + paymentAmount;
        const isFullyPaid = newAmountPaid >= invoice.total_amount;

        // Record in invoice_payments table
        await db.prepare(`
          INSERT INTO invoice_payments (
            id, invoice_id, order_id, amount, payment_method, reference, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          `pay-${Date.now()}`,
          invoice.id,
          invoice.order_id,
          paymentAmount,
          paymentMethod,
          reference || `BACS-VERIFIED-${Date.now()}`,
          notes || 'Verified BACS bank payment'
        );

        // Update invoice
        await db.prepare(`
          UPDATE invoices 
          SET 
            amount_paid = ?,
            status = ?,
            paid_at = ${isFullyPaid ? 'CURRENT_TIMESTAMP' : 'paid_at'},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(newAmountPaid, isFullyPaid ? 'paid' : 'partially_paid', invoice.id);

        // Update associated order payment_status to 'paid'
        if (isFullyPaid) {
          await db.prepare(`
            UPDATE orders 
            SET 
              payment_status = 'paid',
              order_status = CASE 
                WHEN order_status = 'awaiting_payment' THEN 'approved_for_fulfilment'
                ELSE order_status
              END,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(invoice.order_id);
        }

        // Audit log
        await db.prepare(`
          INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, details)
          VALUES (?, ?, 'INVOICE_PAYMENT_RECORDED', 'invoice', ?, ?)
        `).run(
          `audit-${Date.now()}`,
          adminUserName,
          invoice.id,
          `Recorded payment of £${paymentAmount.toFixed(2)} on invoice ${invoice.invoice_number} via ${paymentMethod}`
        );
      } else if (action === 'send_reminder') {
        await db.prepare(`
          INSERT INTO email_logs (id, recipient_email, subject, template_type, related_entity_type, related_entity_id, status, body_html)
          VALUES (?, ?, ?, 'bacs_payment_reminder', 'invoice', ?, 'sent', ?)
        `).run(
          `email-rem-${Date.now()}`,
          invoice.sent_to_email || 'finance@school.co.uk',
          `Payment Reminder: Outstanding BACS Invoice ${invoice.invoice_number}`,
          invoice.id,
          `<p>This is a polite reminder that invoice ${invoice.invoice_number} for £${invoice.total_amount.toFixed(2)} remains due.</p>`
        );
      }
    });

    return NextResponse.json({ success: true, message: 'Invoice updated successfully' });
  } catch (error: any) {
    console.error('API PATCH /invoices error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
