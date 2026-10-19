export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendEmail } from '@/lib/email-service';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const schoolId = searchParams.get('schoolId');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        o.*,
        s.name as school_name,
        org.name as organisation_name,
        inv.invoice_number,
        inv.status as invoice_status
      FROM orders o
      LEFT JOIN schools s ON o.school_id = s.id
      LEFT JOIN organisations org ON o.organisation_id = org.id
      LEFT JOIN invoices inv ON o.id = inv.order_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND o.order_status = ?';
      params.push(status);
    }

    if (schoolId) {
      query += ' AND o.school_id = ?';
      params.push(schoolId);
    }

    if (search) {
      query += ' AND (o.order_reference LIKE ? OR o.contact_name LIKE ? OR s.name LIKE ? OR o.po_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY o.created_at DESC';

    const orders = db.prepare(query).all(...params);

    // Fetch items for each order
    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: getItems.all(order.id),
    }));

    return NextResponse.json({ success: true, orders: ordersWithItems });
  } catch (error: any) {
    console.error('API GET /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      schoolName,
      urn,
      headteacherName,
      headteacherEmail,
      contactName,
      contactEmail,
      contactPhone,
      deliveryAddress1,
      deliveryAddress2,
      deliveryCity,
      deliveryPostcode,
      deliveryInstructions,
      billingOrgName,
      billingAddress1,
      billingAddress2,
      billingCity,
      billingPostcode,
      poNumber,
      paymentMethod, // 'card' or 'bacs_invoice'
      items, // [{ productId, quantity }]
      requisitionDocName,
      cardPaymentDetails, // simulated stripe or test card
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Basket is empty' }, { status: 400 });
    }

    // 1. Resolve or create Organisation & School
    let orgId = 'org-default';
    let schoolId = 'sch-default';

    // Look up existing school by name or postcode
    const existingSchool = db.prepare('SELECT id, organisation_id FROM schools WHERE name = ? OR postcode = ?').get(schoolName, deliveryPostcode) as any;

    if (existingSchool) {
      schoolId = existingSchool.id;
      orgId = existingSchool.organisation_id;
    } else {
      // Create new org & school
      orgId = `org-${Date.now()}`;
      schoolId = `sch-${Date.now()}`;

      db.prepare(`
        INSERT INTO organisations (id, name, type, billing_email, billing_phone)
        VALUES (?, ?, 'Single School', ?, ?)
      `).run(orgId, billingOrgName || schoolName, contactEmail, contactPhone);

      db.prepare(`
        INSERT INTO schools (id, organisation_id, urn, name, address_line1, address_line2, town_city, postcode, headteacher_name, headteacher_email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        schoolId, orgId, urn || 'UK-SCH', schoolName, deliveryAddress1, deliveryAddress2 || null,
        deliveryCity, deliveryPostcode, headteacherName || contactName, headteacherEmail || contactEmail, contactPhone
      );
    }

    // 2. Server-side recalculation of prices (Never trust client prices)
    const productIds = items.map((i: any) => i.productId);
    const placeholders = productIds.map(() => '?').join(',');
    const dbProducts = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...productIds) as any[];

    let subtotal = 0;
    const validatedItems: any[] = [];
    let requiresRequisition = false;

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId);
      if (!dbProd) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (dbProd.requires_headteacher_requisition) {
        requiresRequisition = true;
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const lineSubtotal = dbProd.price * qty;
      const vatAmount = lineSubtotal * 0.20;
      const lineTotal = lineSubtotal + vatAmount;

      subtotal += lineSubtotal;
      validatedItems.push({
        productId: dbProd.id,
        name: dbProd.name,
        strength: dbProd.strength,
        packSize: dbProd.pack_size,
        unitPrice: dbProd.price,
        quantity: qty,
        vatAmount,
        totalPrice: lineTotal,
      });
    }

    const vatTotal = subtotal * 0.20;
    const shippingTotal = 0.00; // Free tracked UK courier
    const totalAmount = subtotal + vatTotal + shippingTotal;

    // 3. Generate sequential order reference: e.g. A4S-2026-00104
    const countRow = db.prepare('SELECT count(*) as count FROM orders').get() as { count: number };
    const orderSeq = (countRow?.count || 0) + 104;
    const orderReference = `A4S-2026-${orderSeq.toString().padStart(5, '0')}`;
    const orderId = `ord-${Date.now()}`;

    // Workflow status
    const isBACS = paymentMethod === 'bacs_invoice';
    const paymentStatus = isBACS ? 'pending' : 'paid';
    const orderStatus = isBACS ? 'awaiting_payment' : (requiresRequisition ? 'awaiting_pharmacy_approval' : 'approved_for_fulfilment');
    const docStatus = requisitionDocName ? 'uploaded' : 'pending';

    // 4. Insert Order inside transaction
    db.transaction(() => {
      db.prepare(`
        INSERT INTO orders (
          id, order_reference, organisation_id, school_id, contact_name, contact_email, contact_phone,
          delivery_school_name, delivery_address_line1, delivery_address_line2, delivery_city, delivery_postcode, delivery_instructions,
          billing_organisation_name, billing_address_line1, billing_address_line2, billing_city, billing_postcode, po_number,
          subtotal, vat_total, shipping_total, total_amount, payment_method, payment_status, order_status,
          documentation_status, pharmacy_review_status, requisition_doc_name, internal_notes
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, 'pending', ?, ?
        )
      `).run(
        orderId, orderReference, orgId, schoolId, contactName, contactEmail, contactPhone,
        schoolName, deliveryAddress1, deliveryAddress2 || null, deliveryCity, deliveryPostcode, deliveryInstructions || null,
        billingOrgName || schoolName, billingAddress1, billingAddress2 || null, billingCity, billingPostcode, poNumber || null,
        subtotal, vatTotal, shippingTotal, totalAmount, paymentMethod, paymentStatus, orderStatus,
        docStatus, requisitionDocName || null, isBACS ? 'BACS Invoice requested by school' : 'Card payment captured via Stripe checkout'
      );

      // Insert Order Items
      const insertItem = db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, product_name, strength, pack_size, unit_price, quantity, vat_amount, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < validatedItems.length; i++) {
        const item = validatedItems[i];
        insertItem.run(
          `item-${orderId}-${i + 1}`,
          orderId,
          item.productId,
          item.name,
          item.strength,
          item.packSize,
          item.unitPrice,
          item.quantity,
          item.vatAmount,
          item.totalPrice
        );
      }

      // If BACS Invoice, generate formal invoice record
      if (isBACS) {
        const invCount = db.prepare('SELECT count(*) as count FROM invoices').get() as { count: number };
        const invSeq = (invCount?.count || 0) + 104;
        const invoiceNumber = `INV-2026-${invSeq.toString().padStart(5, '0')}`;
        const issueDate = new Date().toISOString().split('T')[0];
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 30); // 30 days credit terms
        const dueDate = dueDateObj.toISOString().split('T')[0];

        db.prepare(`
          INSERT INTO invoices (
            id, invoice_number, order_id, organisation_id, school_id, issue_date, due_date, po_number,
            subtotal, vat_total, total_amount, amount_paid, status, bacs_bank_name, bacs_account_name,
            bacs_sort_code, bacs_account_number, bacs_reference, notes, sent_to_email, sent_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, 0.00, 'issued', 'Barclays Bank UK PLC', 'Adrenaline4Schools Limited',
            '20-00-00', '83920184', ?, ?, ?, CURRENT_TIMESTAMP
          )
        `).run(
          `inv-${orderId}`,
          invoiceNumber,
          orderId,
          orgId,
          schoolId,
          issueDate,
          dueDate,
          poNumber || null,
          subtotal,
          vatTotal,
          totalAmount,
          `A4S-${orderReference.replace('A4S-', '')}`,
          'Official 30-Day BACS School Invoice issued. Standard UK educational payment terms.',
          contactEmail
        );
      }

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (id, user_name, action, entity_type, entity_id, details)
        VALUES (?, ?, 'ORDER_CREATED', 'order', ?, ?)
      `).run(
        `audit-${Date.now()}`,
        contactName,
        orderId,
        `Order ${orderReference} created (${paymentMethod.toUpperCase()}). Total: £${totalAmount.toFixed(2)}`
      );
    })();

    // 5. Send Order Confirmation Email
    const emailSubject = isBACS
      ? `Order & BACS Invoice Request Received: ${orderReference} - Adrenaline4Schools`
      : `Order Confirmation: ${orderReference} - Adrenaline4Schools`;

    const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f766e;">Thank You For Your School Order</h2>
        <p>Your order reference is: <strong>${orderReference}</strong></p>
        <p>School: <strong>${schoolName}</strong></p>
        <p>Total: <strong>£${totalAmount.toFixed(2)}</strong> (inc VAT)</p>
        <p>Payment Method: <strong>${isBACS ? 'BACS Invoice (30 Days Terms)' : 'Card Paid'}</strong></p>
        ${
          isBACS
            ? '<p>Your BACS invoice has been generated. Please arrange bank transfer within 30 days quoting reference: <strong>A4S-' +
              orderReference.replace('A4S-', '') +
              '</strong></p>'
            : '<p>Payment has been successfully authorized and your requisition is scheduled for GPhC pharmacy verification.</p>'
        }
        <p>You can track the progress of this order in your School Portal anytime.</p>
      </div>
    `;

    sendEmail({
      to: contactEmail,
      subject: emailSubject,
      templateType: isBACS ? 'bacs_invoice_order_confirmation' : 'card_order_confirmation',
      relatedEntityType: 'order',
      relatedEntityId: orderId,
      html: emailBody,
    });

    return NextResponse.json({
      success: true,
      orderId,
      orderReference,
      paymentMethod,
      totalAmount,
      orderStatus,
    });
  } catch (error: any) {
    console.error('API POST /orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
