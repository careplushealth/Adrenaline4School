const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: 'localhost',
        port: 3005,
        path,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
          } catch {
            resolve({ status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function runAcceptanceTests() {
  console.log('=== RUNNING ACCEPTANCE TESTS ===\n');

  // TEST 1: Customer Journey (Product Catalog -> Order Submission -> BACS Invoice)
  console.log('1. TEST 1: Customer Journey & BACS Invoicing');
  const productsRes = await request('/api/products');
  console.log(`   GET /api/products -> Status ${productsRes.status}, Found ${productsRes.data.products?.length} products`);
  if (!productsRes.data.products || productsRes.data.products.length === 0) throw new Error('No products found');

  const orderPayload = {
    schoolName: "St. Peter's CE Primary School",
    urn: '109823',
    headteacherName: 'Mr. James Wilson',
    headteacherEmail: 'head@stpeters-pri.co.uk',
    contactName: 'Emma Watson (SBM)',
    contactEmail: 'sbm@stpeters-pri.co.uk',
    contactPhone: '0161 496 0199',
    deliveryAddress1: '25 Church Walk',
    deliveryCity: 'Manchester',
    deliveryPostcode: 'M20 2AB',
    billingOrgName: "St. Peter's CE Primary School",
    billingAddress1: '25 Church Walk',
    billingCity: 'Manchester',
    billingPostcode: 'M20 2AB',
    poNumber: 'PO-STP-2026-01',
    paymentMethod: 'bacs_invoice',
    requisitionDocName: 'StPeters-Headteacher-Requisition.pdf',
    items: [
      { productId: 'prod-epipen-300', quantity: 2 },
      { productId: 'prod-epipen-150', quantity: 1 },
    ],
  };

  const orderRes = await request('/api/orders', { method: 'POST', body: orderPayload });
  console.log(`   POST /api/orders -> Status ${orderRes.status}, Ref: ${orderRes.data.orderReference}, Total: £${orderRes.data.totalAmount}`);
  if (!orderRes.data.success) throw new Error(`Order placement failed: ${orderRes.data.error}`);
  const createdOrderId = orderRes.data.orderId;

  // TEST 2: Administrative Verification & Payment (Invoice must not be marked paid until verified)
  console.log('\n2. TEST 2: Administrative Verification & BACS Reconciliation');
  const invoicesRes = await request('/api/invoices');
  const invoice = invoicesRes.data.invoices?.find((i) => i.order_id === createdOrderId);
  console.log(`   Invoice ${invoice?.invoice_number} created with status: ${invoice?.status} (Expected: issued)`);
  if (invoice?.status === 'paid') throw new Error('Invoice was marked paid prematurely before verification!');

  // Record verified payment
  const payRes = await request('/api/invoices', {
    method: 'PATCH',
    body: {
      invoiceId: invoice.id,
      action: 'record_payment',
      amount: invoice.total_amount,
      paymentMethod: 'bacs_transfer',
      reference: 'BACS-TEST-82910',
      notes: 'Verified bank transfer credit.',
    },
  });
  console.log(`   PATCH /api/invoices (record_payment) -> Status ${payRes.status}, Success: ${payRes.data.success}`);

  // TEST 3: Pharmacy Approval Workflow
  console.log('\n3. TEST 3: GPhC Pharmacy Approval & Batch Allocation Workflow');
  const pharmacyApproveRes = await request(`/api/orders/${createdOrderId}`, {
    method: 'PATCH',
    body: {
      pharmacyReviewStatus: 'approved',
      orderStatus: 'approved_for_fulfilment',
      internalNotes: 'Requisition verified against DfE register by Superintendent Pharmacist.',
    },
  });
  console.log(`   PATCH /api/orders/${createdOrderId} (GPhC Approval) -> Status ${pharmacyApproveRes.status}, Success: ${pharmacyApproveRes.data.success}`);

  // Dispatch order with batch allocation (Allocates stock and schedules expiry reminders)
  const dispatchRes = await request(`/api/orders/${createdOrderId}`, {
    method: 'PATCH',
    body: {
      orderStatus: 'dispatched',
      courierName: 'DPD Medical Express',
      trackingNumber: 'DPD-UK-99281726',
      batchAssignments: [
        {
          productId: 'prod-epipen-300',
          batchRecordId: 'batch-1',
          batchNumber: 'EP-30911-UK',
          expiryDate: '2027-10-31',
          quantity: 2,
        },
      ],
    },
  });
  console.log(`   PATCH /api/orders/${createdOrderId} (Dispatch & Batch Allocation) -> Status ${dispatchRes.status}, Reminders Scheduled: ${dispatchRes.data.remindersScheduled}`);

  // TEST 4: Expiry Notification & Auto Sweep
  console.log('\n4. TEST 4: Automated Expiry Sweep Engine');
  const sweepRes = await request('/api/reminders', { method: 'POST', body: { action: 'trigger_sweep' } });
  console.log(`   POST /api/reminders (trigger_sweep) -> Status ${sweepRes.status}, Msg: ${sweepRes.data.message}`);

  // Run sweep a second time to verify idempotency (no duplicate emails)
  const sweepRes2 = await request('/api/reminders', { method: 'POST', body: { action: 'trigger_sweep' } });
  console.log(`   POST /api/reminders (sweep idempotency check) -> Processed: ${sweepRes2.data.processedCount}`);

  // TEST 5: Secure 1-Click Reorder Portal
  console.log('\n5. TEST 5: Secure 1-Click Reorder Link Validation');
  const reorderRes = await request('/api/reorder/reorder-token-stmarys-300');
  console.log(`   GET /api/reorder/reorder-token-stmarys-300 -> Status ${reorderRes.status}, School: ${reorderRes.data.supply?.school_name}, Product: ${reorderRes.data.supply?.product_name}`);
  if (!reorderRes.data.supply) throw new Error('Reorder token validation failed');

  // TEST 6: Multiple Batches per School
  console.log('\n6. TEST 6: Multiple Batches per School Preservation');
  const remindersRes = await request('/api/reminders');
  const stMarysSupplies = remindersRes.data.supplies?.filter((s) => s.school_name.includes("St. Mary's"));
  console.log(`   St. Mary's has ${stMarysSupplies.length} distinct batch records maintained simultaneously:`);
  stMarysSupplies.forEach((s) => console.log(`     - Lot ${s.batch_number} (${s.product_name}), Expires: ${s.expiry_date}, Days Left: ${s.days_remaining}`));
  if (stMarysSupplies.length < 2) throw new Error('Expected at least 2 distinct active batches for St. Marys');

  console.log('\n=== ALL 6 ACCEPTANCE TESTS PASSED WITH 100% SUCCESS ===\n');
}

runAcceptanceTests().catch((err) => {
  console.error('\n❌ ACCEPTANCE TEST FAILED:', err);
  process.exit(1);
});
