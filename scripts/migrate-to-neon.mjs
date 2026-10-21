import { Pool } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Load connection string from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/DATABASE_URL="([^"]+)"/) || envContent.match(/DATABASE_URL=([^\r\n]+)/);
if (!match) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const connectionString = match[1].trim();

console.log('Connecting to Neon PostgreSQL...');
const pool = new Pool({ connectionString });

const pgSchema = `
CREATE TABLE IF NOT EXISTS organisations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Single School',
    company_or_charity_number TEXT,
    billing_email TEXT NOT NULL,
    billing_phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    urn TEXT,
    name TEXT NOT NULL,
    phase TEXT DEFAULT 'Primary',
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    town_city TEXT NOT NULL,
    postcode TEXT NOT NULL,
    headteacher_name TEXT NOT NULL,
    headteacher_email TEXT NOT NULL,
    designated_allergy_lead TEXT,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    organisation_id TEXT REFERENCES organisations(id) ON DELETE SET NULL,
    school_id TEXT REFERENCES schools(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'school_staff',
    job_title TEXT,
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    email_verified INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL,
    name TEXT NOT NULL,
    strength TEXT NOT NULL,
    target_group TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    price REAL NOT NULL,
    vat_rate REAL DEFAULT 0.20,
    is_available INTEGER DEFAULT 1,
    requires_headteacher_requisition INTEGER DEFAULT 1,
    requires_pharmacy_approval INTEGER DEFAULT 1,
    description TEXT NOT NULL,
    clinical_notes TEXT,
    storage_instructions TEXT DEFAULT 'Store below 25°C. Do not refrigerate or freeze. Protect from light.',
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_reference TEXT UNIQUE NOT NULL,
    organisation_id TEXT NOT NULL REFERENCES organisations(id),
    school_id TEXT NOT NULL REFERENCES schools(id),
    user_id TEXT REFERENCES users(id),
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    delivery_school_name TEXT NOT NULL,
    delivery_address_line1 TEXT NOT NULL,
    delivery_address_line2 TEXT,
    delivery_city TEXT NOT NULL,
    delivery_postcode TEXT NOT NULL,
    delivery_instructions TEXT,
    billing_organisation_name TEXT NOT NULL,
    billing_address_line1 TEXT NOT NULL,
    billing_address_line2 TEXT,
    billing_city TEXT NOT NULL,
    billing_postcode TEXT NOT NULL,
    po_number TEXT,
    subtotal REAL NOT NULL,
    vat_total REAL NOT NULL,
    shipping_total REAL DEFAULT 0.00,
    total_amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'submitted',
    documentation_status TEXT DEFAULT 'pending',
    pharmacy_review_status TEXT DEFAULT 'pending',
    courier_name TEXT,
    tracking_number TEXT,
    dispatched_at TIMESTAMP,
    delivered_at TIMESTAMP,
    requisition_doc_name TEXT,
    requisition_doc_url TEXT,
    internal_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL,
    strength TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    vat_amount REAL NOT NULL,
    total_price REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    organisation_id TEXT NOT NULL REFERENCES organisations(id),
    school_id TEXT NOT NULL REFERENCES schools(id),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    po_number TEXT,
    subtotal REAL NOT NULL,
    vat_total REAL NOT NULL,
    total_amount REAL NOT NULL,
    amount_paid REAL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'issued',
    bacs_bank_name TEXT DEFAULT 'Barclays Bank UK PLC',
    bacs_account_name TEXT DEFAULT 'Adrenaline4Schools Limited',
    bacs_sort_code TEXT DEFAULT '20-00-00',
    bacs_account_number TEXT DEFAULT '83920184',
    bacs_reference TEXT NOT NULL,
    notes TEXT,
    sent_to_email TEXT,
    sent_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_payments (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL REFERENCES orders(id),
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    reference TEXT,
    verified_by_user_id TEXT REFERENCES users(id),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_records (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    batch_number TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_received INTEGER NOT NULL,
    quantity_allocated INTEGER DEFAULT 0,
    supplier_ref TEXT,
    is_active INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS school_supply_records (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    school_id TEXT NOT NULL REFERENCES schools(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    batch_record_id TEXT NOT NULL REFERENCES batch_records(id),
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_supplied INTEGER NOT NULL,
    supplied_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    replaced_by_order_id TEXT REFERENCES orders(id),
    reorder_token TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expiry_reminders (
    id TEXT PRIMARY KEY,
    supply_record_id TEXT NOT NULL REFERENCES school_supply_records(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id),
    interval_months INTEGER NOT NULL,
    scheduled_date DATE NOT NULL,
    recipient_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP,
    error_message TEXT,
    reorder_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    related_entity_type TEXT,
    related_entity_id TEXT,
    status TEXT NOT NULL DEFAULT 'sent',
    error_detail TEXT,
    body_html TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    summary TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    pass_mark_percentage INTEGER DEFAULT 80,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS training_lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_html TEXT NOT NULL,
    video_url TEXT,
    key_takeaways TEXT,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_option_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS training_enrolments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'in_progress',
    quiz_score INTEGER,
    passed INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    certificate_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    certificate_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id),
    course_id TEXT NOT NULL REFERENCES training_courses(id),
    school_id TEXT REFERENCES schools(id),
    recipient_name TEXT NOT NULL,
    school_name TEXT NOT NULL,
    course_title TEXT NOT NULL,
    score_percentage INTEGER NOT NULL,
    issued_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    school_name TEXT,
    category TEXT NOT NULL,
    order_reference TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_content (
    key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    section TEXT NOT NULL,
    content_json TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    type TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log('1. Creating PostgreSQL tables on Neon...');
  await pool.query(pgSchema);
  console.log('Tables created successfully.');

  // Open SQLite database
  const sqliteDb = new Database('data/adrenaline.db');

  // Tables in dependency order
  const tables = [
    'organisations',
    'schools',
    'users',
    'products',
    'batch_records',
    'orders',
    'order_items',
    'invoices',
    'invoice_payments',
    'school_supply_records',
    'expiry_reminders',
    'email_logs',
    'training_courses',
    'training_modules',
    'training_lessons',
    'quiz_questions',
    'training_enrolments',
    'certificates',
    'contact_submissions',
    'audit_logs',
    'cms_content',
    'auth_tokens'
  ];

  console.log('2. Migrating rows from SQLite to Neon Postgres...');
  for (const table of tables) {
    const rows = sqliteDb.prepare(`SELECT * FROM ${table}`).all();
    if (rows.length === 0) continue;

    const cols = Object.keys(rows[0]);
    const primaryKey = table === 'cms_content' ? 'key' : 'id';

    for (const row of rows) {
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const updateSet = cols
        .filter((c) => c !== primaryKey)
        .map((c) => `${c} = EXCLUDED.${c}`)
        .join(', ');

      const query = `
        INSERT INTO ${table} (${cols.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (${primaryKey}) ${
          updateSet ? `DO UPDATE SET ${updateSet}` : 'DO NOTHING'
        }
      `;

      const values = cols.map((c) => row[c]);
      await pool.query(query, values);
    }

    console.log(`  ✓ ${table}: ${rows.length} rows migrated`);
  }

  console.log('3. Verifying Neon Postgres row counts:');
  for (const table of tables) {
    const res = await pool.query(`SELECT count(*) as count FROM ${table}`);
    console.log(`  • ${table}: ${res.rows[0].count} rows in Neon`);
  }

  await pool.end();
  console.log('Migration to Neon Postgres complete!');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
