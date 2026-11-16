export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateRequisitionPDF } from '@/lib/pdf-service';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const order = await db.prepare(`
      SELECT 
        o.*,
        s.name as school_name,
        s.headteacher_name,
        s.headteacher_email,
        s.postcode as school_postcode,
        s.phone as school_phone,
        org.name as organisation_name
      FROM orders o
      LEFT JOIN schools s ON o.school_id = s.id
      LEFT JOIN organisations org ON o.organisation_id = org.id
      WHERE o.id = ? OR o.order_reference = ?
    `).get(orderId, orderId) as any;

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
    order.items = items;

    const doc = generateRequisitionPDF(order);
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Requisition-${order.order_reference || order.id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Order Requisition PDF error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
