export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateInvoicePDF } from '@/lib/pdf-service';
import { sendOfficialInvoiceEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      invoiceId,
      recipientEmail,
      poNumber,
      dueDate,
      notes,
      bacsSortCode = '20-45-45',
      bacsAccountNumber = '83920184',
      bacsReference,
      totalAmount,
    } = body;

    if (!orderId && !invoiceId) {
      return NextResponse.json({ success: false, error: 'Order ID or Invoice ID required' }, { status: 400 });
    }

    // 1. Fetch Order and Invoice
    let invoice: any = null;
    if (invoiceId) {
      invoice = await db.prepare('SELECT * FROM invoices WHERE id = ? OR invoice_number = ?').get(invoiceId, invoiceId);
    }
    if (!invoice && orderId) {
      invoice = await db.prepare('SELECT * FROM invoices WHERE order_id = ?').get(orderId);
    }

    const order = await db.prepare(`
      SELECT 
        o.*,
        s.name as school_name,
        s.headteacher_name,
        s.headteacher_email,
        s.phone as school_phone,
        org.name as organisation_name
      FROM orders o
      LEFT JOIN schools s ON o.school_id = s.id
      LEFT JOIN organisations org ON o.organisation_id = org.id
      WHERE o.id = ? OR o.order_reference = ?
    `).get(orderId || invoice?.order_id, orderId || invoice?.order_id) as any;

    if (!order) {
      return NextResponse.json({ success: false, error: 'Associated order not found' }, { status: 404 });
    }

    const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
    order.items = items;

    // 2. If no invoice exists yet, create one
    if (!invoice) {
      const invCount = (await db.prepare('SELECT count(*) as count FROM invoices').get() as { count: number })?.count || 0;
      const invNum = `INV-2026-${String(invCount + 1001).padStart(5, '0')}`;
      const now = new Date();
      const issueDate = now.toISOString().split('T')[0];
      const due = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const invId = `inv-${Date.now()}`;

      await db.prepare(`
        INSERT INTO invoices (
          id, organisation_id, school_id, order_id, invoice_number, issue_date, due_date,
          subtotal, vat_amount, total_amount, amount_paid, status, po_number,
          bacs_reference, bacs_sort_code, bacs_account_number, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'issued', ?, ?, ?, ?, ?)
      `).run(
        invId,
        order.organisation_id,
        order.school_id,
        order.id,
        invNum,
        issueDate,
        dueDate || due,
        order.subtotal || order.total_amount / 1.2,
        order.vat_amount || order.total_amount - (order.total_amount / 1.2),
        order.total_amount,
        poNumber || order.po_number || null,
        bacsReference || invNum,
        bacsSortCode,
        bacsAccountNumber,
        notes || null
      );

      invoice = await db.prepare('SELECT * FROM invoices WHERE id = ?').get(invId);
    } else {
      // Update any edited fields
      await db.prepare(`
        UPDATE invoices
        SET 
          po_number = COALESCE(?, po_number),
          due_date = COALESCE(?, due_date),
          bacs_sort_code = COALESCE(?, bacs_sort_code),
          bacs_account_number = COALESCE(?, bacs_account_number),
          bacs_reference = COALESCE(?, bacs_reference),
          notes = COALESCE(?, notes),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        poNumber || null,
        dueDate || null,
        bacsSortCode || null,
        bacsAccountNumber || null,
        bacsReference || null,
        notes || null,
        invoice.id
      );

      invoice = await db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoice.id);
    }

    const schoolName = order.school_name || order.delivery_school_name || 'School';
    const targetEmail = (recipientEmail || order.contact_email || order.headteacher_email || '').trim();

    if (!targetEmail) {
      return NextResponse.json({ success: false, error: 'Recipient email address is required.' }, { status: 400 });
    }

    // 3. Generate Official Invoice PDF
    const doc = generateInvoicePDF({
      ...invoice,
      school_name: schoolName,
      organisation_name: order.organisation_name,
      bacs_sort_code: bacsSortCode || invoice.bacs_sort_code || '20-45-45',
      bacs_account_number: bacsAccountNumber || invoice.bacs_account_number || '83920184',
      bacs_reference: bacsReference || invoice.bacs_reference || invoice.invoice_number,
    }, order);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    const pdfBase64 = pdfBuffer.toString('base64');

    // 4. Send email via Gmail API
    const emailResult = await sendOfficialInvoiceEmail({
      to: targetEmail,
      invoiceNumber: invoice.invoice_number,
      orderReference: order.order_reference,
      schoolName,
      subtotal: invoice.subtotal || (invoice.total_amount / 1.2),
      vatAmount: invoice.vat_amount || (invoice.total_amount - invoice.total_amount / 1.2),
      totalAmount: invoice.total_amount,
      poNumber: invoice.po_number,
      dueDate: invoice.due_date,
      bacsSortCode: bacsSortCode || invoice.bacs_sort_code || '20-45-45',
      bacsAccountNumber: bacsAccountNumber || invoice.bacs_account_number || '83920184',
      bacsReference: bacsReference || invoice.bacs_reference || invoice.invoice_number,
      customNotes: notes || invoice.notes,
      pdfBase64,
    });

    // 5. Update invoice sent_at and sent_to_email
    await db.prepare(`
      UPDATE invoices
      SET sent_at = CURRENT_TIMESTAMP, sent_to_email = ?
      WHERE id = ?
    `).run(targetEmail, invoice.id);

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoice.invoice_number} successfully dispatched to ${targetEmail} via Gmail.`,
      invoiceNumber: invoice.invoice_number,
      provider: emailResult.provider || 'gmail_api',
    });
  } catch (error: any) {
    console.error('API /api/invoices/send error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to dispatch invoice' }, { status: 500 });
  }
}
