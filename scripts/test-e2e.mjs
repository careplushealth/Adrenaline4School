const BASE_URL = 'http://127.0.0.1:3000';

async function testEndpoint(name, url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    const passed = res.ok && (data.success !== false);
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} (HTTP ${res.status})`);
    if (!passed) {
      console.error('Response:', JSON.stringify(data, null, 2));
    }
    return { passed, status: res.status, data };
  } catch (err) {
    console.log(`[FAIL] ${name} - Error: ${err.message}`);
    return { passed: false, error: err.message };
  }
}

async function run() {
  console.log('====================================================');
  console.log(' RUNNING END-TO-END NEON POSTGRES INTEGRATION TESTS ');
  console.log(' Target: ' + BASE_URL);
  console.log('====================================================\n');

  let total = 0;
  let passed = 0;

  async function check(name, url, opts) {
    total++;
    const res = await testEndpoint(name, url, opts);
    if (res.passed) passed++;
    return res;
  }

  // 1. Products API (reads from Neon)
  const products = await check('GET /api/products', `${BASE_URL}/api/products`);
  if (products.passed && products.data?.products) {
    console.log(`       Found ${products.data.products.length} products in Neon.`);
  }

  // 2. Schools API (reads from Neon)
  const schools = await check('GET /api/schools', `${BASE_URL}/api/schools`);
  if (schools.passed && schools.data?.schools) {
    console.log(`       Found ${schools.data.schools.length} schools in Neon.`);
  }

  // 3. Admin Stats API (complex aggregate SQL with Neon date arithmetic)
  const stats = await check('GET /api/admin/stats', `${BASE_URL}/api/admin/stats`);
  if (stats.passed && stats.data?.stats) {
    console.log(`       Revenue: £${stats.data.stats.totalRevenue}, Active Schools: ${stats.data.stats.activeSchools}`);
  }

  // 4. Training API (Neon courses and enrolments)
  const training = await check('GET /api/training', `${BASE_URL}/api/training`);
  if (training.passed && training.data?.courses) {
    console.log(`       Found ${training.data.courses.length} courses in Neon.`);
  }

  // 5. CMS Content GET & POST (Neon UPSERT and query)
  const cmsPost = await check('POST /api/content (UPSERT)', `${BASE_URL}/api/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: 'neon_test_key',
      title: 'Neon E2E Verified',
      section: 'system',
      contentJson: { status: 'operational', timestamp: Date.now() },
    }),
  });

  const cmsGet = await check('GET /api/content?key=neon_test_key', `${BASE_URL}/api/content?key=neon_test_key`);
  if (cmsGet.passed && cmsGet.data?.item) {
    console.log(`       Retrieved persisted key: "${cmsGet.data.item.key}" from Neon.`);
  }

  // 6. Contact Submission (INSERT into Neon contact_submissions and email_logs)
  const contact = await check('POST /api/contact', `${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Jane Test',
      email: 'jane.test@primaryschool.co.uk',
      schoolName: 'St. Test Primary',
      category: 'Stock Query',
      message: 'Verifying end-to-end database connectivity on Neon PostgreSQL.',
    }),
  });

  // 7. Orders API (reads order lists and relations from Neon)
  const orders = await check('GET /api/orders', `${BASE_URL}/api/orders`);
  if (orders.passed && orders.data?.orders) {
    console.log(`       Found ${orders.data.orders.length} orders in Neon.`);
  }

  // 8. Reminders API (reads approaching expiry reminders from Neon)
  const reminders = await check('GET /api/reminders', `${BASE_URL}/api/reminders`);
  if (reminders.passed && reminders.data?.reminders) {
    console.log(`       Found ${reminders.data.reminders.length} reminders in Neon.`);
  }

  // 9. Batches API
  const batches = await check('GET /api/batches', `${BASE_URL}/api/batches`);
  if (batches.passed && batches.data?.batches) {
    console.log(`       Found ${batches.data.batches.length} batches in Neon.`);
  }

  // 10. Invoices API
  const invoices = await check('GET /api/invoices', `${BASE_URL}/api/invoices`);
  if (invoices.passed && invoices.data?.invoices) {
    console.log(`       Found ${invoices.data.invoices.length} invoices in Neon.`);
  }

  // 11. School Portal Registration & 6-digit PIN Dispatch Flow
  const testEmail = `lead_${Date.now()}@chelsea-prep.sch.uk`;
  const regResult = await check('POST /api/auth/school/register', `${BASE_URL}/api/auth/school/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolName: 'Chelsea Preparatory School',
      urn: '100412',
      postcode: 'SW3 4RY',
      contactName: 'Mrs Claire Thompson',
      email: testEmail,
      phone: '020 7352 1100',
      password: 'SecureSchoolPass2026!',
    }),
  });

  let verificationCode = regResult.data?.verificationCode;
  if (regResult.passed) {
    console.log(`       Registered school user: ${testEmail} (Code dispatched via email service)`);
  }

  // 12. If code returned (mock/dev fallback), verify the PIN
  if (verificationCode) {
    const verifyResult = await check('POST /api/auth/school/verify', `${BASE_URL}/api/auth/school/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        code: verificationCode,
      }),
    });
    if (verifyResult.passed) {
      console.log(`       Verified account with 6-digit PIN: ${verificationCode}`);
    }
  }

  // 13. School Login with seeded account
  const loginResult = await check('POST /api/auth/school/login', `${BASE_URL}/api/auth/school/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'sbm@stmarys-school.co.uk',
      password: 'school2026',
    }),
  });
  if (loginResult.passed && loginResult.data?.user) {
    console.log(`       Authenticated school coordinator: ${loginResult.data.user.name}`);
  }

  // 14. DfE GIAS Database Search (by school name)
  const searchNameResult = await check('GET /api/schools/search?q=Grammar', `${BASE_URL}/api/schools/search?q=Grammar`);
  if (searchNameResult.passed && searchNameResult.data?.schools) {
    console.log(`       Found ${searchNameResult.data.schools.length} UK Grammar schools in directory.`);
  }

  // 15. DfE GIAS Database Search (by postcode)
  const searchPostcodeResult = await check('GET /api/schools/search?q=SW1A', `${BASE_URL}/api/schools/search?q=SW1A`);
  if (searchPostcodeResult.passed && searchPostcodeResult.data?.schools) {
    console.log(`       Found ${searchPostcodeResult.data.schools.length} schools matching Westminster postcode SW1A.`);
  }

  // 16. Stripe Create Payment Intent API
  const stripeResult = await check('POST /api/stripe/create-payment-intent', `${BASE_URL}/api/stripe/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 199.98,
      schoolName: 'Chelsea Preparatory School',
      contactEmail: testEmail,
      orderReference: 'TEST-A4S-001',
    }),
  });
  if (stripeResult.passed && stripeResult.data?.clientSecret) {
    console.log(`       Initialized Stripe PaymentIntent: ${stripeResult.data.paymentIntentId}`);
  }

  // 17. End-to-End Order Creation via Stripe Card Payment
  const cardOrderResult = await check('POST /api/orders (Stripe Card Checkout)', `${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolName: 'Chelsea Preparatory School',
      urn: '100412',
      headteacherName: 'Dr. Gary Savage',
      contactName: 'Mrs Claire Thompson',
      contactEmail: testEmail,
      deliveryAddress1: '14 Royal Hospital Road',
      deliveryCity: 'London',
      deliveryPostcode: 'SW3 4RY',
      paymentMethod: 'card',
      items: [{ productId: 'prod-epipen-300', quantity: 2 }],
      cardPaymentDetails: {
        last4: '4242',
        cardHolder: 'Mrs Claire Thompson',
        stripePaymentSecret: stripeResult.data?.clientSecret,
      },
    }),
  });
  if (cardOrderResult.passed && cardOrderResult.data?.orderReference) {
    console.log(`       Created Paid Card Order: ${cardOrderResult.data.orderReference}`);
  }

  // 18. End-to-End Order Creation via 30-Day BACS Invoice
  const bacsOrderResult = await check('POST /api/orders (30-Day BACS School Invoice)', `${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      schoolName: 'Westminster School',
      urn: '100523',
      headteacherName: 'Dr. Gary Savage',
      headteacherEmail: 'headmaster@westminster.org.uk',
      contactName: 'School Medical Coordinator',
      contactEmail: 'medical@westminster.org.uk',
      deliveryAddress1: '17A Dean’s Yard',
      deliveryCity: 'London',
      deliveryPostcode: 'SW1P 3PB',
      paymentMethod: 'bacs_invoice',
      poNumber: 'PO-WEST-2026-001',
      items: [{ productId: 'prod-jext-150', quantity: 4 }],
    }),
  });
  if (bacsOrderResult.passed && bacsOrderResult.data?.orderReference) {
    console.log(`       Created BACS Invoice Order: ${bacsOrderResult.data.orderReference}`);
  }

  // 19. Static Legal Compliance Pages
  await check('GET /terms', `${BASE_URL}/terms`);
  await check('GET /privacy', `${BASE_URL}/privacy`);
  await check('GET /checkout', `${BASE_URL}/checkout`);
  await check('GET /portal', `${BASE_URL}/portal`);

  console.log('\n====================================================');
  console.log(` RESULT: ${passed}/${total} ENDPOINTS PASSED SUCCESSFULLY `);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

run();
