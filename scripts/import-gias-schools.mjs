import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Readable } from 'stream';

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/DATABASE_URL="([^"]+)"/) || content.match(/DATABASE_URL=([^\r\n]+)/);
      if (match) databaseUrl = match[1].trim();
    }
  } catch (e) {}
}

const pool = new Pool({ connectionString: databaseUrl });

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function run() {
  console.log('Downloading latest official DfE GIAS school dataset...');
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const url = `https://ea-edubase-api-prod.azurewebsites.net/edubase/downloads/public/edubasealldata${todayStr}.csv`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download GIAS dataset: HTTP ${res.status}`);
  }

  console.log('Streaming and parsing open schools into Neon PostgreSQL...');

  const rl = readline.createInterface({
    input: Readable.fromWeb(res.body),
    crlfDelay: Infinity,
  });

  let headers = null;
  let headerIndex = {};
  let batch = [];
  let totalInserted = 0;
  const BATCH_SIZE = 400;

  async function flushBatch() {
    if (batch.length === 0) return;
    const currentBatch = [...batch];
    batch = [];

    const valueClauses = [];
    const params = [];
    let pIdx = 1;

    for (const s of currentBatch) {
      valueClauses.push(
        `($${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++})`
      );
      params.push(
        s.urn,
        s.name,
        s.phase,
        s.type,
        s.local_authority,
        s.address_line1,
        s.address_line2,
        s.town_city,
        s.postcode,
        s.phone,
        s.headteacher_name,
        s.headteacher_email,
        s.office_email
      );
    }

    const query = `
      INSERT INTO uk_schools_directory (
        urn, name, phase, type, local_authority, address_line1, address_line2, town_city,
        postcode, phone, headteacher_name, headteacher_email, office_email
      ) VALUES ${valueClauses.join(', ')}
      ON CONFLICT (urn) DO UPDATE SET
        name = EXCLUDED.name,
        phase = EXCLUDED.phase,
        type = EXCLUDED.type,
        local_authority = EXCLUDED.local_authority,
        address_line1 = EXCLUDED.address_line1,
        town_city = EXCLUDED.town_city,
        postcode = EXCLUDED.postcode,
        phone = EXCLUDED.phone,
        headteacher_name = EXCLUDED.headteacher_name,
        headteacher_email = EXCLUDED.headteacher_email,
        office_email = EXCLUDED.office_email
    `;

    await pool.query(query, params);
    totalInserted += currentBatch.length;
    process.stdout.write(`\rImported ${totalInserted} open UK schools...`);
  }

  for await (const line of rl) {
    if (!headers) {
      headers = parseCSVLine(line);
      headers.forEach((h, idx) => {
        headerIndex[h.replace(/^"|"$/g, '')] = idx;
      });
      continue;
    }

    if (!line.trim()) continue;
    const cols = parseCSVLine(line);

    const status = cols[headerIndex['EstablishmentStatus (name)']];
    if (status !== 'Open') continue;

    const urn = cols[headerIndex['URN']];
    const name = cols[headerIndex['EstablishmentName']];
    if (!urn || !name) continue;

    const phase = cols[headerIndex['PhaseOfEducation (name)']];
    const type = cols[headerIndex['TypeOfEstablishment (name)']];
    const la = cols[headerIndex['LA (name)']];
    const street = cols[headerIndex['Street']];
    const locality = cols[headerIndex['Locality']];
    const town = cols[headerIndex['Town']];
    const postcode = cols[headerIndex['Postcode']];
    const phone = cols[headerIndex['TelephoneNum']];
    const website = cols[headerIndex['SchoolWebsite']];

    const headTitle = cols[headerIndex['HeadTitle (name)']] || '';
    const headFirst = cols[headerIndex['HeadFirstName']] || '';
    const headLast = cols[headerIndex['HeadLastName']] || '';
    const headteacherName = [headTitle, headFirst, headLast].filter(Boolean).join(' ') || 'Headteacher';

    let domain = '';
    if (website) {
      domain = website.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
    }

    const headteacherEmail = domain ? `head@${domain}` : null;
    const officeEmail = domain ? `office@${domain}` : null;

    batch.push({
      urn,
      name,
      phase: phase || 'Primary',
      type: type || 'Maintained',
      local_authority: la || 'England',
      address_line1: street || '',
      address_line2: locality || null,
      town_city: town || la || '',
      postcode: postcode || '',
      phone: phone || '',
      headteacher_name: headteacherName,
      headteacher_email: headteacherEmail,
      office_email: officeEmail,
    });

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  }

  await flushBatch();
  console.log(`\nDONE! Total open UK schools in database: ${totalInserted}`);
  await pool.end();
}

run().catch((err) => {
  console.error('\nError importing GIAS dataset:', err);
  process.exit(1);
});
