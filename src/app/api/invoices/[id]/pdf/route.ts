export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateInvoicePDF } from '@/lib/pdf-service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    const invoice = await db.prepare(`
      SELECT 
        inv.*,
        s.name as school_name,
        org.name as organisation_name,
        o.order_reference,
        o.delivery_school_name,
        o.delivery_address_line1,
        o.delivery_city,
        o.delivery_postcode,
        o.billing_organisation_name,
        o.billing_address_line1,
        o.billing_city,
        o.billing_postcode
      FROM invoices inv
      JOIN orders o ON inv.order_id = o.id
      JOIN schools s ON inv.school_id = s.id
      JOIN organisations org ON inv.organisation_id = org.id
      WHERE inv.id = ? OR inv.invoice_number = ?
    `).get(invoiceId, invoiceId) as any;

    if (!invoice) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(invoice.order_id) as any[];
    const doc = generateInvoicePDF(invoice, { ...invoice, items });
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Invoice PDF API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
