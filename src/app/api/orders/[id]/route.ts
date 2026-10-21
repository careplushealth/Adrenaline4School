export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const order = await db.prepare(`
      SELECT 
        o.*,
        s.name as school_name,
        s.urn as school_urn,
        s.headteacher_name,
        org.name as organisation_name,
        inv.id as invoice_id,
        inv.invoice_number,
        inv.status as invoice_status,
        inv.due_date as invoice_due_date,
        inv.bacs_reference
      FROM orders o
      LEFT JOIN schools s ON o.school_id = s.id
      LEFT JOIN organisations org ON o.organisation_id = org.id
      LEFT JOIN invoices inv ON o.id = inv.order_id
      WHERE o.id = ? OR o.order_reference = ?
    `).get(orderId, orderId) as any;

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const items = await db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const supplyRecords = await db.prepare('SELECT * FROM school_supply_records WHERE order_id = ?').all(order.id);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items,
        supplyRecords,
      },
    });
  } catch (error: any) {
    console.error('API GET /orders/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const {
      orderStatus,
      pharmacyReviewStatus,
      documentationStatus,
      courierName,
      trackingNumber,
      internalNotes,
      batchAssignments, // Array of { productId, batchRecordId, batchNumber, expiryDate, quantity }
      adminUserName = 'Admin User',
    } = body;

    const existingOrder = await db.prepare('SELECT * FROM orders WHERE id = ? OR order_reference = ?').get(orderId, orderId) as any;
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const realOrderId = existingOrder.id;

    await db.transaction(async () => {
      // 1. Update order fields
      const updates: string[] = [];
      const values: any[] = [];

      if (orderStatus) {
        updates.push('order_status = ?');
        values.push(orderStatus);
        if (orderStatus === 'dispatched') {
          updates.push('dispatched_at = CURRENT_TIMESTAMP');
        } else if (orderStatus === 'delivered') {
          updates.push('delivered_at = CURRENT_TIMESTAMP');
        }
      }

      if (pharmacyReviewStatus) {
        updates.push('pharmacy_review_status = ?');
        values.push(pharmacyReviewStatus);
        if (pharmacyReviewStatus === 'approved') {
          updates.push('documentation_status = ?');
          values.push('verified');
        }
      }

      if (documentationStatus) {
        updates.push('documentation_status = ?');
        values.push(documentationStatus);
      }

      if (courierName !== undefined) {
        updates.push('courier_name = ?');
        values.push(courierName);
      }

      if (trackingNumber !== undefined) {
        updates.push('tracking_number = ?');
        values.push(trackingNumber);
      }

      if (internalNotes !== undefined) {
        updates.push('internal_notes = ?');
        values.push(internalNotes);
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');

      if (updates.length > 0) {
        values.push(realOrderId);
        await db.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).run(...values);
      }

      // 2. Process batch allocations and register school supply records
      if (batchAssignments && Array.isArray(batchAssignments) && batchAssignments.length > 0) {
        for (const alloc of batchAssignments) {
          const supplyId = `sup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const reorderToken = `reorder-${crypto.randomBytes(12).toString('hex')}`;

          // Create supply record for the school
          await db.prepare(`
            INSERT INTO school_supply_records (
              id, order_id, school_id, product_id, batch_record_id, batch_number, expiry_date,
              quantity_supplied, supplied_date, status, reorder_token, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, 'active', ?, ?)
          `).run(
            supplyId,
            realOrderId,
            existingOrder.school_id,
            alloc.productId,
            alloc.batchRecordId || 'batch-custom',
            alloc.batchNumber,
            alloc.expiryDate,
            alloc.quantity || 1,
            reorderToken,
            `Supplied under order ${existingOrder.order_reference}`
          );

          // Update batch allocated quantity in batch_records
          if (alloc.batchRecordId) {
            await db.prepare(`
              UPDATE batch_records 
              SET quantity_allocated = quantity_allocated + ?
              WHERE id = ?
            `).run(alloc.quantity || 1, alloc.batchRecordId);
          }

          // Schedule automated expiry reminders at 12m, 6m, 3m, 1m before expiry
          const expDate = new Date(alloc.expiryDate);
          const intervals = [12, 6, 3, 1];

          for (const interval of intervals) {
            const schedDate = new Date(expDate);
            schedDate.setMonth(schedDate.getMonth() - interval);
            const schedDateStr = schedDate.toISOString().split('T')[0];

            await db.prepare(`
              INSERT INTO expiry_reminders (
                id, supply_record_id, school_id, interval_months, scheduled_date, recipient_email, status, reorder_token
              ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
            `).run(
              `rem-${supplyId}-${interval}m`,
              supplyId,
              existingOrder.school_id,
              interval,
              schedDateStr,
              existingOrder.contact_email,
              reorderToken
            );
          }
        }
      }

      // Audit Log
      await db.prepare(`
        INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, details)
        VALUES (?, ?, 'ORDER_UPDATED', 'order', ?, ?)
      `).run(
        `audit-${Date.now()}`,
        adminUserName,
        realOrderId,
        `Updated order ${existingOrder.order_reference} status: ${orderStatus || 'N/A'}, pharmacy: ${pharmacyReviewStatus || 'N/A'}`
      );
    });

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error: any) {
    console.error('API PATCH /orders/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
