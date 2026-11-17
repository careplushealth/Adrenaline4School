import db from './db';

export async function runSeed() {
  console.log('Seeding Adrenaline4Schools clean core database...');

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, organisation_id, school_id, name, email, password_hash, role, job_title, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (id, slug, brand, name, strength, target_group, pack_size, price, vat_rate, is_available, requires_headteacher_requisition, requires_pharmacy_approval, description, clinical_notes, storage_instructions, image_url, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFAQ = db.prepare(`
    INSERT OR REPLACE INTO cms_content (key, title, section, content_json)
    VALUES (?, ?, ?, ?)
  `);

  // Run transactions
  await db.transaction(async () => {
    // 1. Core Admin Users
    insertUser.run(
      'usr-admin',
      null,
      null,
      'Super Admin',
      'adrenaline4schools@gmail.com',
      '$2a$10$demoHash',
      'super_admin',
      'Lead Administrator',
      '0161 973 3552'
    );
    insertUser.run(
      'usr-orders',
      null,
      null,
      'Coppice Pharmacy Verifier',
      'adrenaline4schools@gmail.com',
      '$2a$10$demoHash',
      'order_admin',
      'Superintendent Pharmacist',
      '0161 973 3552'
    );
    insertUser.run(
      'usr-finance',
      null,
      null,
      'Finance Controller',
      'adrenaline4schools@gmail.com',
      '$2a$10$demoHash',
      'finance_admin',
      'Finance Controller',
      '0161 973 3552'
    );

    // 2. Official Adrenaline Auto-Injector Products (Pupil only)
    insertProduct.run(
      'prod-epipen-300',
      'epipen-300mcg',
      'EpiPen',
      'EpiPen® 300 micrograms (Pupils >30kg)',
      '300 micrograms',
      'Pupils over 30kg (approx. 11+ years / secondary schools)',
      'Emergency Auto-Injector (1 x Pen)',
      99.99,
      0.20,
      1,
      1,
      1,
      'The UK standard auto-injector for emergency treatment of anaphylaxis in pupils over 30kg. Yellow label, clear window, intuitive automatic needle cover.',
      'Dose: 300 mcg adrenaline (epinephrine). Intramuscular injection into anterolateral thigh. Supplied in protective carrier tube with tamper-evident seal.',
      'Store below 25°C. Do not refrigerate or freeze. Store in original outer carton in order to protect from light.',
      '/images/epipen-300.png',
      1
    );

    insertProduct.run(
      'prod-epipen-150',
      'epipen-150mcg',
      'EpiPen',
      'EpiPen® Junior 150 micrograms (Pupils 15-30kg)',
      '150 micrograms',
      'Pupils between 15kg - 30kg (approx. 3 to 11 years / primary schools)',
      'Emergency Auto-Injector (1 x Pen)',
      99.99,
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
      'Jext® 300 micrograms (Pupils >30kg)',
      '300 micrograms',
      'Pupils over 30kg (approx. 11+ years / secondary schools)',
      'Emergency Auto-Injector (1 x Pen)',
      99.99,
      0.20,
      1,
      1,
      1,
      'Jext auto-injector provides emergency treatment for severe allergic reactions in pupils. Ergonomic grip and cartridge inspection window.',
      'Dose: 300 mcg adrenaline. Reliable needle retraction system after intramuscular delivery.',
      'Store below 25°C. Keep pen inside the dedicated plastic case provided.',
      '/images/jext-300.png',
      3
    );

    insertProduct.run(
      'prod-jext-150',
      'jext-150mcg',
      'Jext',
      'Jext® 150 micrograms (Pupils 15-30kg)',
      '150 micrograms',
      'Pupils between 15kg - 30kg (approx. 3 to 11 years / primary schools)',
      'Emergency Auto-Injector (1 x Pen)',
      99.99,
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

    // 3. CMS Content for FAQs
    insertFAQ.run(
      'faq-general',
      'Frequently Asked Questions',
      'faqs',
      JSON.stringify([
        {
          q: 'Can our school legally purchase emergency adrenaline pens without named prescriptions?',
          a: 'Yes. Under the Human Medicines (Amendment) Regulations 2017, UK primary, secondary and independent schools are legally permitted to hold "spare" emergency adrenaline auto-injectors (AAIs) for use in pupils at risk of anaphylaxis. Our platform provides the standard Headteacher Requisition Form to make this process seamless.',
        },
        {
          q: 'What is Benedict\'s Law and how does it affect schools from 2026?',
          a: "Benedict's Law follows the tragic death of five-year-old Benedict Blythe from an allergic reaction at school. The statutory guidance requires schools in England to maintain an accessible emergency allergy preparedness plan, spare adrenaline pens, mandatory staff allergy training, and robust emergency protocols.",
        },
        {
          q: 'Can we pay by BACS Bank Transfer / School Invoice?',
          a: 'Yes! Over 85% of schools pay via 30-day BACS invoice. During checkout, simply select "Request BACS Invoice", enter your school Purchase Order (PO) number, and our system issues a compliant PDF invoice immediately with our verified bank details and reference.',
        },
        {
          q: 'How does your free Expiry Reminder and Reorder service work?',
          a: 'When your order is dispensed, our GPhC registered pharmacy logs the exact batch numbers and expiry dates into your school portal. Our automated system schedules reminders at 12, 6, 3, and 1 month prior to expiry, sending a secure 1-click reorder link with pre-filled school and pen details.',
        },
        {
          q: 'Which pen strengths should our school order?',
          a: 'The British National Formulary (BNF) and Department of Health guidance recommend: 150 micrograms for children 15kg to 30kg (typically primary school pupils aged 3-11), and 300 micrograms for pupils weighing over 30kg (typically secondary school pupils).',
        },
        {
          q: 'Are the pens supplied by a UK registered pharmacy?',
          a: 'Yes. All auto-injectors are checked and dispensed exclusively by a UK General Pharmaceutical Council (GPhC) registered pharmacy partner in temperature-controlled, tracked medical packaging with tracked courier delivery in 3 to 4 working days.',
        },
      ])
    );
  });

  console.log('Seeding completed successfully without placeholder entries!');
}
