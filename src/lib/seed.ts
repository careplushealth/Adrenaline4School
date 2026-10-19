import db from './db';

export function runSeed() {
  console.log('Seeding Adrenaline4Schools database...');

  const insertOrg = db.prepare(`
    INSERT OR REPLACE INTO organisations (id, name, type, company_or_charity_number, billing_email, billing_phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertSchool = db.prepare(`
    INSERT OR REPLACE INTO schools (id, organisation_id, urn, name, phase, address_line1, address_line2, town_city, postcode, headteacher_name, headteacher_email, designated_allergy_lead, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, organisation_id, school_id, name, email, password_hash, role, job_title, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (id, slug, brand, name, strength, target_group, pack_size, price, vat_rate, is_available, requires_headteacher_requisition, requires_pharmacy_approval, description, clinical_notes, storage_instructions, image_url, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertBatch = db.prepare(`
    INSERT OR REPLACE INTO batch_records (id, product_id, batch_number, manufacturer, expiry_date, quantity_received, quantity_allocated, supplier_ref, is_active, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO orders (
      id, order_reference, organisation_id, school_id, user_id, contact_name, contact_email, contact_phone,
      delivery_school_name, delivery_address_line1, delivery_address_line2, delivery_city, delivery_postcode, delivery_instructions,
      billing_organisation_name, billing_address_line1, billing_address_line2, billing_city, billing_postcode, po_number,
      subtotal, vat_total, shipping_total, total_amount, payment_method, payment_status, order_status,
      documentation_status, pharmacy_review_status, courier_name, tracking_number, internal_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT OR REPLACE INTO order_items (id, order_id, product_id, product_name, strength, pack_size, unit_price, quantity, vat_amount, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertInvoice = db.prepare(`
    INSERT OR REPLACE INTO invoices (
      id, invoice_number, order_id, organisation_id, school_id, issue_date, due_date, po_number,
      subtotal, vat_total, total_amount, amount_paid, status, bacs_bank_name, bacs_account_name,
      bacs_sort_code, bacs_account_number, bacs_reference, notes, sent_to_email, sent_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSupply = db.prepare(`
    INSERT OR REPLACE INTO school_supply_records (
      id, order_id, school_id, product_id, batch_record_id, batch_number, expiry_date,
      quantity_supplied, supplied_date, status, reorder_token, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertReminder = db.prepare(`
    INSERT OR REPLACE INTO expiry_reminders (
      id, supply_record_id, school_id, interval_months, scheduled_date, recipient_email, status, reorder_token
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCourse = db.prepare(`
    INSERT OR REPLACE INTO training_courses (id, slug, title, category, duration_minutes, summary, target_audience, pass_mark_percentage, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertModule = db.prepare(`
    INSERT OR REPLACE INTO training_modules (id, course_id, title, display_order)
    VALUES (?, ?, ?, ?)
  `);

  const insertLesson = db.prepare(`
    INSERT OR REPLACE INTO training_lessons (id, module_id, title, content_html, video_url, key_takeaways, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQuiz = db.prepare(`
    INSERT OR REPLACE INTO quiz_questions (id, course_id, question, options_json, correct_option_index, explanation, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFAQ = db.prepare(`
    INSERT OR REPLACE INTO cms_content (key, title, section, content_json)
    VALUES (?, ?, ?, ?)
  `);

  // Run transactions
  db.transaction(() => {
    // 1. Organisations
    insertOrg.run('org-1', "St. Mary's Church of England Primary", 'Single School', '102941-SCH', 'accounts@stmarys-school.co.uk', '020 7946 0192');
    insertOrg.run('org-2', 'Aethelstan Multi-Academy Trust', 'Multi-Academy Trust (MAT)', '08291048', 'finance@aethelstan-trust.org.uk', '0117 496 0321');

    // 2. Schools
    insertSchool.run(
      'sch-1', 'org-1', '102941', "St. Mary's CE Primary School", 'Primary',
      '14 Church Lane', 'Kensington', 'London', 'W8 4PT',
      'Mrs. Eleanor Clarke', 'head@stmarys-school.co.uk', 'Mrs. Rachel Stevens (SBM)', '020 7946 0192'
    );
    insertSchool.run(
      'sch-2', 'org-2', '139820', 'Highfield Academy Bristol', 'Secondary',
      'Parkway Way', 'Stoke Bishop', 'Bristol', 'BS9 1EG',
      'Dr. Robert Campbell', 'head@highfield-bristol.org.uk', 'Mr. David Miller', '0117 496 0322'
    );
    insertSchool.run(
      'sch-3', 'org-2', '141029', 'Meadowbrook Primary School', 'Primary',
      'Orchard Close', 'Keynsham', 'Bristol', 'BS31 2FR',
      'Ms. Karen Davies', 'head@meadowbrook-pri.org.uk', 'Sarah Jenkins', '0117 496 0323'
    );

    // 3. Users
    // Password hash placeholder for demo: 'password123'
    insertUser.run('usr-admin', null, null, 'Antigravity Super Admin', 'admin@adrenaline4schools.co.uk', '$2a$10$demoHash', 'super_admin', 'Lead Administrator', '0800 123 4567');
    insertUser.run('usr-orders', null, null, 'GPhC Pharmacy Verifier', 'pharmacy@adrenaline4schools.co.uk', '$2a$10$demoHash', 'order_admin', 'Superintendent Pharmacist', '0800 123 4568');
    insertUser.run('usr-finance', null, null, 'Fiona Adams', 'finance@adrenaline4schools.co.uk', '$2a$10$demoHash', 'finance_admin', 'Finance Controller', '0800 123 4569');
    insertUser.run('usr-school-1', 'org-1', 'sch-1', 'Mrs. Rachel Stevens', 'sbm@stmarys-school.co.uk', '$2a$10$demoHash', 'school_admin', 'School Business Manager', '020 7946 0192');
    insertUser.run('usr-school-2', 'org-1', 'sch-1', 'Sarah Jenkins', 'sarah.jenkins@stmarys-school.co.uk', '$2a$10$demoHash', 'school_staff', 'Year 3 Lead & First Aider', '020 7946 0192');
    insertUser.run('usr-trust-1', 'org-2', 'sch-2', 'Gareth Taylor', 'gareth.taylor@aethelstan-trust.org.uk', '$2a$10$demoHash', 'school_admin', 'MAT Estates & Compliance Lead', '0117 496 0321');

    // 4. Products
    insertProduct.run(
      'prod-epipen-300',
      'epipen-300mcg',
      'EpiPen',
      'EpiPen® 300 micrograms (Adult / Child >30kg)',
      '300 micrograms',
      'Children and adults over 30kg (approx. 12+ years / secondary schools)',
      'Twin Pack (2 x 300mcg Pens)',
      98.50,
      0.20,
      1,
      1,
      1,
      'The UK standard auto-injector for emergency treatment of anaphylaxis in older children and adults. Yellow label, clear window, intuitive automatic needle cover.',
      'Dose: 300 mcg adrenaline (epinephrine). Intramuscular injection into anterolateral thigh. Supplied in protective carrier tube with tamper-evident seal.',
      'Store below 25°C. Do not refrigerate or freeze. Store in original outer carton in order to protect from light.',
      '/images/epipen-300.png',
      1
    );

    insertProduct.run(
      'prod-epipen-150',
      'epipen-150mcg',
      'EpiPen',
      'EpiPen® Junior 150 micrograms (Child 15-30kg)',
      '150 micrograms',
      'Children between 15kg - 30kg (approx. 3 to 11 years / primary schools)',
      'Twin Pack (2 x 150mcg Pens)',
      98.50,
      0.20,
      1,
      1,
      1,
      'Specifically formulated and calibrated for primary school aged pupils. Green/White label with high visibility instructions and safety guard.',
      'Dose: 150 mcg adrenaline (epinephrine). Intramuscular injection into anterolateral thigh.',
      'Store below 25°C. Do not refrigerate or freeze. Store in original outer carton in order to protect from light.',
      '/images/epipen-150.png',
      2
    );

    insertProduct.run(
      'prod-jext-300',
      'jext-300mcg',
      'Jext',
      'Jext® 300 micrograms (Adult / Child >30kg)',
      '300 micrograms',
      'Children and adults over 30kg (approx. 12+ years / secondary schools)',
      'Twin Pack (2 x 300mcg Pens)',
      92.00,
      0.20,
      1,
      1,
      1,
      'Jext auto-injector provides emergency treatment for severe allergic reactions. Ergonomic grip and cartridge inspection window.',
      'Dose: 300 mcg adrenaline. Reliable needle retraction system after intramuscular delivery.',
      'Store below 25°C. Keep pen inside the dedicated plastic case provided.',
      '/images/jext-300.png',
      3
    );

    insertProduct.run(
      'prod-jext-150',
      'jext-150mcg',
      'Jext',
      'Jext® 150 micrograms (Child 15-30kg)',
      '150 micrograms',
      'Children between 15kg - 30kg (approx. 3 to 11 years / primary schools)',
      'Twin Pack (2 x 150mcg Pens)',
      92.00,
      0.20,
      1,
      1,
      1,
      'Jext junior auto-injector calibrated for primary school pupils weighing 15-30kg. Blue/White label with clear step-by-step illustrations.',
      'Dose: 150 mcg adrenaline. Intramuscular injection into the outer thigh.',
      'Store below 25°C. Keep pen inside the dedicated plastic case provided.',
      '/images/jext-150.png',
      4
    );

    insertProduct.run(
      'prod-wall-kit',
      'emergency-anaphylaxis-wall-station',
      'Emergency Kits',
      'Emergency Anaphylaxis Wall Station & Grab Bag',
      'Universal Mount',
      'All school medical rooms, staff rooms, dining halls & sports pavilions',
      'Complete Kit with Wall Bracket, Signage & Log Book',
      34.50,
      0.20,
      1,
      0,
      0,
      'High-visibility green emergency station compliant with UK Department of Health Guidance on Adrenaline in Schools. Includes wall mounting hardware, high-impact emergency protocol guide, pen storage pouch and monthly check register.',
      'Essential for school preparedness and meeting Benedict\'s Law accessibility standards.',
      'Wall mountable in central, easily accessible staff location away from direct sunlight.',
      '/images/wall-kit.png',
      5
    );

    // 5. Batch Records
    insertBatch.run('batch-1', 'prod-epipen-300', 'EP-30911-UK', 'Viatris / Mylan UK', '2027-10-31', 500, 18, 'PO-PHARM-9021', 1, 'Fresh batch received from UK distributor');
    insertBatch.run('batch-2', 'prod-epipen-150', 'EP-15820-UK', 'Viatris / Mylan UK', '2027-04-30', 400, 14, 'PO-PHARM-9022', 1, 'Batch expiring in ~6 months for reminder testing');
    insertBatch.run('batch-3', 'prod-jext-300', 'JX-30119-UK', 'ALK-Abelló UK', '2027-01-31', 300, 8, 'PO-PHARM-8941', 1, 'Batch expiring in ~3 months (Approaching expiry)');
    insertBatch.run('batch-4', 'prod-jext-150', 'JX-15044-UK', 'ALK-Abelló UK', '2026-11-30', 250, 6, 'PO-PHARM-8820', 1, 'Batch expiring in ~1 month (Urgent reminder active)');

    // 6. Orders
    // Order 1: Delivered and supplied (EpiPen 300 + EpiPen 150)
    insertOrder.run(
      'ord-101', 'A4S-2026-00101', 'org-1', 'sch-1', 'usr-school-1',
      'Mrs. Rachel Stevens', 'sbm@stmarys-school.co.uk', '020 7946 0192',
      "St. Mary's CE Primary School", '14 Church Lane', 'Kensington', 'London', 'W8 4PT', 'Deliver to Main School Reception between 8:30am and 3:30pm',
      "St. Mary's Church of England Primary", '14 Church Lane', 'Kensington', 'London', 'W8 4PT', 'PO-STM-2026-09',
      197.00, 39.40, 0.00, 236.40, 'bacs_invoice', 'paid', 'delivered',
      'verified', 'approved', 'DPD Medical Express', 'DPD-UK-98210398',
      'Requisition signed by Headteacher Mrs. Eleanor Clarke. Verified by Superintendent Pharmacist.'
    );

    insertOrderItem.run('item-101-1', 'ord-101', 'prod-epipen-300', 'EpiPen® 300 micrograms (Adult / Child >30kg)', '300 micrograms', 'Twin Pack (2 x 300mcg Pens)', 98.50, 1, 19.70, 118.20);
    insertOrderItem.run('item-101-2', 'ord-101', 'prod-epipen-150', 'EpiPen® Junior 150 micrograms (Child 15-30kg)', '150 micrograms', 'Twin Pack (2 x 150mcg Pens)', 98.50, 1, 19.70, 118.20);

    // Order 2: Awaiting BACS Invoice payment
    insertOrder.run(
      'ord-102', 'A4S-2026-00102', 'org-2', 'sch-2', 'usr-trust-1',
      'Gareth Taylor', 'gareth.taylor@aethelstan-trust.org.uk', '0117 496 0321',
      'Highfield Academy Bristol', 'Parkway Way', 'Stoke Bishop', 'Bristol', 'BS9 1EG', 'Security gate code #4912, deliver to Health Suite',
      'Aethelstan Multi-Academy Trust', 'Parkway Way', 'Stoke Bishop', 'Bristol', 'BS9 1EG', 'PO-MAT-8921-BR',
      218.50, 43.70, 0.00, 262.20, 'bacs_invoice', 'pending', 'awaiting_payment',
      'verified', 'approved', null, null,
      'Requisition verified. Invoice issued to MAT central accounts. Awaiting BACS bank transfer.'
    );

    insertOrderItem.run('item-102-1', 'ord-102', 'prod-jext-300', 'Jext® 300 micrograms (Adult / Child >30kg)', '300 micrograms', 'Twin Pack (2 x 300mcg Pens)', 92.00, 2, 36.80, 220.80);
    insertOrderItem.run('item-102-2', 'ord-102', 'prod-wall-kit', 'Emergency Anaphylaxis Wall Station & Grab Bag', 'Universal Mount', 'Complete Kit', 34.50, 1, 6.90, 41.40);

    // Order 3: Paid by Card, Awaiting Pharmacy Approval
    insertOrder.run(
      'ord-103', 'A4S-2026-00103', 'org-2', 'sch-3', 'usr-trust-1',
      'Ms. Karen Davies', 'head@meadowbrook-pri.org.uk', '0117 496 0323',
      'Meadowbrook Primary School', 'Orchard Close', 'Keynsham', 'Bristol', 'BS31 2FR', 'Front office reception only',
      'Aethelstan Multi-Academy Trust', 'Parkway Way', 'Stoke Bishop', 'Bristol', 'BS9 1EG', 'CARD-TXN-902194',
      98.50, 19.70, 0.00, 118.20, 'card', 'paid', 'awaiting_pharmacy_approval',
      'uploaded', 'pending', null, null,
      'Headteacher requisition uploaded. Awaiting pharmacist GPhC review and batch allocation.'
    );

    insertOrderItem.run('item-103-1', 'ord-103', 'prod-epipen-150', 'EpiPen® Junior 150 micrograms (Child 15-30kg)', '150 micrograms', 'Twin Pack (2 x 150mcg Pens)', 98.50, 1, 19.70, 118.20);

    // 7. Invoices
    insertInvoice.run(
      'inv-101', 'INV-2026-00101', 'ord-101', 'org-1', 'sch-1',
      '2026-09-02', '2026-10-02', 'PO-STM-2026-09',
      197.00, 39.40, 236.40, 236.40, 'paid',
      'Barclays Bank UK PLC', 'Adrenaline4Schools Limited', '20-00-00', '83920184', 'A4S-INV-00101',
      'Payment verified via BACS bank transfer on 15 Sept 2026.', 'accounts@stmarys-school.co.uk', '2026-09-02 10:14:00'
    );

    insertInvoice.run(
      'inv-102', 'INV-2026-00102', 'ord-102', 'org-2', 'sch-2',
      '2026-10-10', '2026-11-10', 'PO-MAT-8921-BR',
      218.50, 43.70, 262.20, 0.00, 'issued',
      'Barclays Bank UK PLC', 'Adrenaline4Schools Limited', '20-00-00', '83920184', 'A4S-INV-00102',
      'Awaiting BACS payment. Standard 30 days school credit terms apply.', 'finance@aethelstan-trust.org.uk', '2026-10-10 11:30:00'
    );

    // 8. School Supply Records (with active expiry tracking!)
    insertSupply.run(
      'sup-1', 'ord-101', 'sch-1', 'prod-epipen-300', 'batch-1', 'EP-30911-UK', '2027-10-31',
      2, '2026-09-05', 'active', 'reorder-token-stmarys-300',
      'Delivered and registered in Medical Room Wall Cabinet A.'
    );

    insertSupply.run(
      'sup-2', 'ord-101', 'sch-1', 'prod-epipen-150', 'batch-2', 'EP-15820-UK', '2027-04-30',
      2, '2026-09-05', 'active', 'reorder-token-stmarys-150',
      'Registered for KS1 & Reception emergency station.'
    );

    // School 2 has stock approaching expiry (Jext 300)
    insertSupply.run(
      'sup-3', 'ord-101', 'sch-2', 'prod-jext-300', 'batch-3', 'JX-30119-UK', '2027-01-31',
      2, '2026-01-15', 'approaching_expiry', 'reorder-token-highfield-300',
      'Stock has 3 months remaining. 3-month automated reminder scheduled.'
    );

    // School 3 has stock approaching 1 month expiry!
    insertSupply.run(
      'sup-4', 'ord-101', 'sch-3', 'prod-jext-150', 'batch-4', 'JX-15044-UK', '2026-11-30',
      2, '2025-11-20', 'approaching_expiry', 'reorder-token-meadowbrook-150',
      'Stock expiring in 1 month! Automated urgent reminder triggered.'
    );

    // 9. Expiry Reminders
    insertReminder.run('rem-1', 'sup-1', 'sch-1', 12, '2026-10-31', 'sbm@stmarys-school.co.uk', 'pending', 'reorder-token-stmarys-300');
    insertReminder.run('rem-2', 'sup-1', 'sch-1', 6, '2027-04-30', 'sbm@stmarys-school.co.uk', 'pending', 'reorder-token-stmarys-300');
    insertReminder.run('rem-3', 'sup-3', 'sch-2', 3, '2026-10-31', 'gareth.taylor@aethelstan-trust.org.uk', 'sent', 'reorder-token-highfield-300');
    insertReminder.run('rem-4', 'sup-4', 'sch-3', 1, '2026-10-30', 'head@meadowbrook-pri.org.uk', 'sent', 'reorder-token-meadowbrook-150');

    // 10. Training Courses, Modules, Lessons, Quizzes
    insertCourse.run(
      'course-1',
      'anaphylaxis-adrenaline-in-schools',
      'Anaphylaxis Awareness & Adrenaline Auto-Injectors in Schools',
      'Clinical & School Safety',
      45,
      'Comprehensive CPD-certified training for all primary and secondary school staff covering allergen recognition, signs of anaphylaxis, emergency action plans, and hands-on administration of EpiPen® and Jext® pens.',
      'Headteachers, Teachers, Teaching Assistants, Lunchtime Supervisors, School Business Managers & First Aiders',
      80,
      1
    );

    insertCourse.run(
      'course-2',
      'benedicts-law-school-allergy-policy',
      "Benedict's Law: Implementing Statutory School Allergy Guidance",
      'Governance & Policy',
      30,
      "Practical guidance for school leadership teams, governors and MAT trustees on implementing England's new statutory allergy guidance (Benedict's Law), including spare pen management, requisitioning, risk assessments and allergy registers.",
      'Senior Leadership Teams (SLT), Headteachers, School Governors, Trust Compliance Officers',
      80,
      2
    );

    // Modules for Course 1
    insertModule.run('mod-1-1', 'course-1', 'Module 1: Understanding Allergies & Anaphylaxis', 1);
    insertModule.run('mod-1-2', 'course-1', 'Module 2: Recognising the Signs of Anaphylaxis (A-B-C Protocol)', 2);
    insertModule.run('mod-1-3', 'course-1', 'Module 3: Using EpiPen® and Jext® in an Emergency', 3);
    insertModule.run('mod-1-4', 'course-1', 'Module 4: Post-Administration Care & Calling 999', 4);

    // Lessons for Course 1
    insertLesson.run(
      'les-1-1', 'mod-1-1',
      'What is Anaphylaxis and Common School Triggers',
      `<p>Anaphylaxis is a severe, life-threatening, generalised or systemic hypersensitivity reaction. It is characterized by rapidly developing life-threatening problems involving the airway (A), breathing (B), and/or circulation (C).</p>
      <p>Common triggers in schools include:</p>
      <ul class="list-disc pl-6 space-y-1 my-3">
        <li><strong>Foods:</strong> Peanuts, tree nuts, milk, eggs, wheat, sesame, fish, shellfish, and kiwi fruit.</li>
        <li><strong>Insect stings:</strong> Wasp and bee stings, especially during outdoor PE or playground activities.</li>
        <li><strong>Medications:</strong> Antibiotics (penicillin), NSAIDs, or vaccines.</li>
        <li><strong>Latex:</strong> Medical gloves, balloons, or sports equipment.</li>
      </ul>
      <p>In the UK, between 1-2% of school-aged children suffer from food allergies, and 20% of fatal anaphylaxis incidents in children happen on school premises.</p>`,
      null,
      'Anaphylaxis is a medical emergency requiring rapid intervention. Common school triggers are nuts, dairy, egg and wasp stings.',
      1
    );

    insertLesson.run(
      'les-1-2', 'mod-1-2',
      'The A-B-C Warning Signs & Sudden Deterioration',
      `<p>Always think <strong>A-B-C</strong> when assessing a pupil who may be experiencing an allergic reaction:</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="font-bold text-red-900">A - Airway</h4>
          <p class="text-sm text-red-800">Swelling in the throat, tongue or lips; hoarse voice; difficulty swallowing or sensation of tightness.</p>
        </div>
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="font-bold text-red-900">B - Breathing</h4>
          <p class="text-sm text-red-800">Persistent cough, wheezing, noisy breathing (stridor), chest tightness, severe shortness of breath.</p>
        </div>
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="font-bold text-red-900">C - Circulation</h4>
          <p class="text-sm text-red-800">Pale, clammy, dizziness, confusion, sudden collapse, floppy child, loss of consciousness.</p>
        </div>
      </div>
      <p><strong>Crucial Rule:</strong> If you suspect anaphylaxis, do NOT wait for skin symptoms (hives or rash) to appear. Up to 20% of severe attacks present with no rash at all.</p>`,
      null,
      'Remember A-B-C: Airway, Breathing, Circulation. Never wait for a rash before administering adrenaline.',
      2
    );

    insertLesson.run(
      'les-1-3', 'mod-1-3',
      'Step-by-Step Auto-Injector Administration',
      `<p>Emergency adrenaline should be injected immediately into the <strong>outer mid-thigh (anterolateral aspect)</strong>. It can be given through clothing if necessary (avoid thick seams or pockets with coins/phones).</p>
      <h4 class="font-bold text-navy-900 mt-4 mb-2">How to use an EpiPen®:</h4>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Hold firmly in your fist with the orange tip pointing downwards. Pull off the blue safety cap.</li>
        <li>Hold approximately 10cm away from the outer thigh, push hard at a 90° angle until a click is heard or felt.</li>
        <li>Hold in place for <strong>3 seconds</strong>.</li>
        <li>Remove pen and massage the injection site for 10 seconds. Note the time.</li>
      </ol>
      <h4 class="font-bold text-navy-900 mt-4 mb-2">How to use a Jext®:</h4>
      <ol class="list-decimal pl-6 space-y-2 mb-4">
        <li>Grasp pen in dominant hand with black tip pointing down. Pull off yellow cap with other hand.</li>
        <li>Place black tip against outer thigh at 90° and push firmly until it clicks.</li>
        <li>Hold firmly against thigh for <strong>10 seconds</strong>.</li>
        <li>Remove and gently massage the site.</li>
      </ol>`,
      null,
      'Always inject into the outer mid-thigh. Blue to the sky, orange to the thigh (EpiPen). Yellow off, black to thigh (Jext).',
      3
    );

    insertLesson.run(
      'les-1-4', 'mod-1-4',
      'Post-Administration, Calling 999 & Secondary Dosing',
      `<p>Immediate steps after administering the first auto-injector:</p>
      <ul class="list-disc pl-6 space-y-2 my-3">
        <li><strong>Call 999 immediately:</strong> State clearly: <em>"Anaphylaxis emergency in a school pupil. Adrenaline auto-injector administered. Blue light response needed."</em></li>
        <li><strong>Patient Positioning:</strong> Keep the pupil lying flat with legs raised. If breathing is difficult, allow them to sit up slightly, but DO NOT stand them up or let them walk. Sudden standing can cause fatal circulatory collapse!</li>
        <li><strong>Second Pen Rule:</strong> If there is no improvement or symptoms worsen after <strong>5 minutes</strong>, administer a second adrenaline auto-injector into the other thigh.</li>
        <li><strong>Keep Used Pens:</strong> Hand used pens safely to paramedics upon arrival.</li>
      </ul>`,
      null,
      'Call 999 blue light immediately. Keep pupil lying flat. If no improvement within 5 minutes, administer the second pen.',
      4
    );

    // Quiz Questions for Course 1
    insertQuiz.run(
      'q-1', 'course-1',
      'Where should an emergency adrenaline auto-injector (EpiPen / Jext) always be injected?',
      JSON.stringify([
        'Upper arm deltoid muscle',
        'Outer mid-thigh (anterolateral thigh)',
        'Abdomen',
        'Directly into a vein in the forearm'
      ]),
      1,
      'The outer mid-thigh is the approved anatomical site because adrenaline is absorbed most rapidly into the bloodstream from the vastus lateralis muscle.',
      1
    );

    insertQuiz.run(
      'q-2', 'course-1',
      'If a child shows no improvement or deteriorates after the first adrenaline dose, after how many minutes should the second pen be administered?',
      JSON.stringify([
        '2 minutes',
        '5 minutes',
        '15 minutes',
        '30 minutes'
      ]),
      1,
      'UK and international Resuscitation Council guidelines state that if symptoms persist or deteriorate, a second dose of adrenaline should be given 5 minutes after the first.',
      2
    );

    insertQuiz.run(
      'q-3', 'course-1',
      'Which position is most critical for a pupil experiencing anaphylaxis?',
      JSON.stringify([
        'Standing up and walking around in fresh air',
        'Lying flat with legs elevated (or sitting up slightly if breathing is very difficult)',
        'Lying completely face down on their stomach',
        'Bent over their knees with their head between their legs'
      ]),
      1,
      'Standing up suddenly can cause blood to drain rapidly from the heart and brain, triggering fatal circulatory collapse. Pupils must remain lying down or reclining.',
      3
    );

    insertQuiz.run(
      'q-4', 'course-1',
      'Under Benedict\'s Law and UK Department of Health guidance, what document is legally required from a school to purchase spare emergency adrenaline auto-injectors?',
      JSON.stringify([
        'An individual doctor prescription for each student',
        'A formal Headteacher Requisition Form signed by the Principal / Head',
        'A letter from the local borough council',
        'Parental consent slips only'
      ]),
      1,
      'The Human Medicines (Amendment) Regulations 2017 allow schools to purchase emergency spare adrenaline pens without named pupil prescriptions via a signed Headteacher Requisition.',
      4
    );

    insertQuiz.run(
      'q-5', 'course-1',
      'What should you do if a child presents with sudden severe throat tightness and breathing difficulty, but has NO skin hives or rash?',
      JSON.stringify([
        'Wait 15 minutes to see if a rash appears before doing anything',
        'Give them a glass of warm water and tell them to rest',
        'Administer the adrenaline auto-injector immediately and call 999',
        'Wait until the school nurse or parents arrive'
      ]),
      2,
      'Up to 20% of severe anaphylactic reactions do not feature any skin rash. Severe airway and breathing symptoms warrant immediate adrenaline administration without delay.',
      5
    );

    // 11. Sample Enrolment and Certificate
    const insertEnrol = db.prepare(`
      INSERT OR REPLACE INTO training_enrolments (id, user_id, course_id, status, quiz_score, passed, completed_at, certificate_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertCert = db.prepare(`
      INSERT OR REPLACE INTO certificates (id, certificate_number, user_id, course_id, school_id, recipient_name, school_name, course_title, score_percentage, issued_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCert.run(
      'cert-101', 'CERT-2026-0914', 'usr-school-2', 'course-1', 'sch-1',
      'Sarah Jenkins', "St. Mary's CE Primary School",
      'Anaphylaxis Awareness & Adrenaline Auto-Injectors in Schools',
      100, '2026-09-15'
    );

    insertEnrol.run(
      'enrol-1', 'usr-school-2', 'course-1', 'completed', 100, 1, '2026-09-15 14:30:00', 'cert-101'
    );

    // 12. CMS Content for FAQs and Statutory Notices
    insertFAQ.run('faq-general', 'Frequently Asked Questions', 'faqs', JSON.stringify([
      {
        q: 'Can our school legally purchase emergency adrenaline pens without named prescriptions?',
        a: 'Yes. Under the Human Medicines (Amendment) Regulations 2017, UK primary, secondary and independent schools are legally permitted to hold "spare" emergency adrenaline auto-injectors (AAIs) for use in pupils at risk of anaphylaxis. Our platform provides the standard Headteacher Requisition Form to make this process seamless.'
      },
      {
        q: 'What is Benedict\'s Law and how does it affect schools from 2026?',
        a: 'Benedict\'s Law follows the tragic death of five-year-old Benedict Blythe from an allergic reaction at school. The statutory guidance requires schools in England to maintain an accessible emergency allergy preparedness plan, spare adrenaline pens, mandatory staff allergy training, and robust emergency protocols.'
      },
      {
        q: 'Can we pay by BACS Bank Transfer / School Invoice?',
        a: 'Yes! Over 85% of schools pay via 30-day BACS invoice. During checkout, simply select "Request BACS Invoice", enter your school Purchase Order (PO) number, and our system issues a compliant PDF invoice immediately with our verified bank details and reference.'
      },
      {
        q: 'How does your free Expiry Reminder and Reorder service work?',
        a: 'When your order is dispensed, our GPhC registered pharmacy logs the exact batch numbers and expiry dates into your school portal. Our automated system schedules reminders at 12, 6, 3, and 1 month prior to expiry, sending a secure 1-click reorder link with pre-filled school and pen details.'
      },
      {
        q: 'Which pen strengths should our school order?',
        a: 'The British National Formulary (BNF) and Department of Health guidance recommend: 150 micrograms for children 15kg to 30kg (typically primary school pupils aged 3-11), and 300 micrograms for pupils and staff weighing over 30kg (typically secondary school pupils and adults).'
      },
      {
        q: 'Are the pens supplied by a UK registered pharmacy?',
        a: 'Yes. All auto-injectors are checked and dispensed exclusively by a UK General Pharmaceutical Council (GPhC) registered pharmacy partner in temperature-controlled, tracked medical packaging with next-day courier delivery.'
      }
    ]));

    // Audit Log initial
    const insertAudit = db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertAudit.run('audit-1', 'usr-admin', 'System Initializer', 'SEED_DATABASE', 'system', 'adrenaline4schools', 'Initialized full database with products, schools, orders, batches and training modules');
  })();

  console.log('Seeding completed successfully!');
}
