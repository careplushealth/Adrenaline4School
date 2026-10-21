export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const batches = await db.prepare(`
      SELECT 
        b.*,
        p.name as product_name,
        p.strength,
        (b.quantity_received - b.quantity_allocated) as quantity_remaining
      FROM batch_records b
      JOIN products p ON b.product_id = p.id
      ORDER BY b.expiry_date ASC
    `).all();

    return NextResponse.json({ success: true, batches });
  } catch (error: any) {
    console.error('API GET /batches error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      batchNumber,
      manufacturer,
      expiryDate,
      quantityReceived,
      supplierRef,
      notes,
    } = body;

    if (!productId || !batchNumber || !expiryDate || !quantityReceived) {
      return NextResponse.json({ success: false, error: 'Missing required batch fields' }, { status: 400 });
    }

    const id = `batch-${Date.now()}`;
    await db.prepare(`
      INSERT INTO batch_records (
        id, product_id, batch_number, manufacturer, expiry_date, quantity_received, quantity_allocated, supplier_ref, notes
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
    `).run(id, productId, batchNumber, manufacturer || 'UK Distributor', expiryDate, quantityReceived, supplierRef || null, notes || null);

    return NextResponse.json({ success: true, id, message: 'Batch recorded successfully' });
  } catch (error: any) {
    console.error('API POST /batches error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
