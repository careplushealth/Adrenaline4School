import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Read DATABASE_URL from .env.local
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

if (!databaseUrl) {
  console.error('DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

const UK_SCHOOLS = [
  // Greater London - Primary & Secondary
  {
    urn: '102941',
    name: "St. Mary's CE Primary School",
    phase: 'Primary',
    type: 'Voluntary Aided School',
    local_authority: 'Kensington and Chelsea',
    address_line1: 'Stratford Road',
    town_city: 'London',
    postcode: 'W8 6QH',
    phone: '020 7937 6360',
    headteacher_name: 'Mrs. Eleanor Clarke',
    headteacher_email: 'head@stmarys.rbkc.sch.uk',
    office_email: 'office@stmarys.rbkc.sch.uk'
  },
  {
    urn: '100049',
    name: 'St Paul’s Cathedral School',
    phase: 'Primary',
    type: 'Independent School',
    local_authority: 'City of London',
    address_line1: '2 New Change',
    town_city: 'London',
    postcode: 'EC4M 9AD',
    phone: '020 7248 5156',
    headteacher_name: 'Mr. Simon Larter-Evans',
    headteacher_email: 'head@spcs.london.sch.uk',
    office_email: 'admin@spcs.london.sch.uk'
  },
  {
    urn: '100523',
    name: 'Westminster School',
    phase: 'Secondary',
    type: 'Independent School',
    local_authority: 'Westminster',
    address_line1: '17A Dean’s Yard',
    town_city: 'London',
    postcode: 'SW1P 3PB',
    phone: '020 7963 1000',
    headteacher_name: 'Dr. Gary Savage',
    headteacher_email: 'headmaster@westminster.org.uk',
    office_email: 'reception@westminster.org.uk'
  },
  {
    urn: '136518',
    name: 'Harris Academy Greenwich',
    phase: 'Secondary',
    type: 'Academy Sponsor Led',
    local_authority: 'Greenwich',
    address_line1: 'Middle Park Avenue',
    town_city: 'Eltham, London',
    postcode: 'SE9 5EQ',
    phone: '020 8859 0133',
    headteacher_name: 'Mr. George McMillan',
    headteacher_email: 'principal@harrisgreenwich.org.uk',
    office_email: 'info@harrisgreenwich.org.uk'
  },
  {
    urn: '138249',
    name: 'Ark Greenwich Free School',
    phase: 'Secondary',
    type: 'Free School',
    local_authority: 'Greenwich',
    address_line1: '403 Shooters Hill Road',
    town_city: 'London',
    postcode: 'SE18 4LG',
    phone: '020 8319 3692',
    headteacher_name: 'Mr. Rhys Spiers',
    headteacher_email: 'headteacher@arkgreenwich.org',
    office_email: 'info@arkgreenwich.org'
  },
  {
    urn: '101344',
    name: 'Dulwich College',
    phase: 'All-through',
    type: 'Independent School',
    local_authority: 'Southwark',
    address_line1: 'Dulwich Common',
    town_city: 'London',
    postcode: 'SE21 7LD',
    phone: '020 8693 3737',
    headteacher_name: 'Dr. Joseph Spence',
    headteacher_email: 'master@dulwich.org.uk',
    office_email: 'enquiries@dulwich.org.uk'
  },
  {
    urn: '100862',
    name: 'Queen Elizabeth’s School, Barnet',
    phase: 'Secondary',
    type: 'Academy Converter (Grammar)',
    local_authority: 'Barnet',
    address_line1: 'Queen’s Road',
    town_city: 'Barnet',
    postcode: 'EN5 4DQ',
    phone: '020 8441 4646',
    headteacher_name: 'Mr. Neil Enright',
    headteacher_email: 'headmaster@qebarnet.co.uk',
    office_email: 'enquiries@qebarnet.co.uk'
  },
  {
    urn: '102608',
    name: 'Tiffin School',
    phase: 'Secondary',
    type: 'Academy Converter (Grammar)',
    local_authority: 'Kingston upon Thames',
    address_line1: 'Queen Elizabeth Road',
    town_city: 'Kingston upon Thames',
    postcode: 'KT2 6RL',
    phone: '020 8546 4638',
    headteacher_name: 'Mr. Michael Gascoigne',
    headteacher_email: 'head@tiffin.kingston.sch.uk',
    office_email: 'office@tiffin.kingston.sch.uk'
  },
  {
    urn: '100449',
    name: 'Camden School for Girls',
    phase: 'Secondary',
    type: 'Voluntary Aided School',
    local_authority: 'Camden',
    address_line1: 'Sandall Road',
    town_city: 'London',
    postcode: 'NW5 2DB',
    phone: '020 7485 3414',
    headteacher_name: 'Ms. Kateryna Law',
    headteacher_email: 'head@csg.school',
    office_email: 'csg@csg.school'
  },
  {
    urn: '101652',
    name: 'Fox Primary School',
    phase: 'Primary',
    type: 'Community School',
    local_authority: 'Kensington and Chelsea',
    address_line1: 'Kensington Place',
    town_city: 'London',
    postcode: 'W8 7PP',
    phone: '020 7727 7637',
    headteacher_name: 'Mr. Paul Cotter',
    headteacher_email: 'head@foxprimary.co.uk',
    office_email: 'admin@foxprimary.co.uk'
  },

  // Bristol & South West
  {
    urn: '139820',
    name: 'Highfield Academy Bristol',
    phase: 'Secondary',
    type: 'Academy Converter',
    local_authority: 'Bristol, City of',
    address_line1: 'Westbury Hill',
    town_city: 'Bristol',
    postcode: 'BS9 1EG',
    phone: '0117 962 4499',
    headteacher_name: 'Mr. Marcus Davies',
    headteacher_email: 'head@highfieldacademy.org.uk',
    office_email: 'info@highfieldacademy.org.uk'
  },
  {
    urn: '141029',
    name: 'Meadowbrook Primary School',
    phase: 'Primary',
    type: 'Academy Converter',
    local_authority: 'South Gloucestershire',
    address_line1: 'Three Brooks Way',
    town_city: 'Bradley Stoke, Bristol',
    postcode: 'BS32 8TA',
    phone: '01454 868630',
    headteacher_name: 'Mrs. Angela Cheetham',
    headteacher_email: 'head@meadowbrookprimary.co.uk',
    office_email: 'office@meadowbrookprimary.co.uk'
  },
  {
    urn: '109312',
    name: 'Bristol Grammar School',
    phase: 'All-through',
    type: 'Independent School',
    local_authority: 'Bristol, City of',
    address_line1: 'University Road',
    town_city: 'Bristol',
    postcode: 'BS8 1SR',
    phone: '0117 973 6006',
    headteacher_name: 'Mr. Jaideep Barot',
    headteacher_email: 'headmaster@bgs.bristol.sch.uk',
    office_email: 'website@bgs.bristol.sch.uk'
  },
  {
    urn: '138814',
    name: 'Redland Green School',
    phase: 'Secondary',
    type: 'Academy Converter',
    local_authority: 'Bristol, City of',
    address_line1: 'Redland Court Road',
    town_city: 'Bristol',
    postcode: 'BS6 7EH',
    phone: '0117 353 3200',
    headteacher_name: 'Mr. Ben Houghton',
    headteacher_email: 'headteacher@redlandgreen.bristol.sch.uk',
    office_email: 'info@redlandgreen.bristol.sch.uk'
  },

  // West Midlands (Birmingham, Solihull, Coventry)
  {
    urn: '103565',
    name: 'King Edward VI Camp Hill School for Boys',
    phase: 'Secondary',
    type: 'Academy Converter (Grammar)',
    local_authority: 'Birmingham',
    address_line1: 'Vicarage Road',
    town_city: 'Kings Heath, Birmingham',
    postcode: 'B14 7QJ',
    phone: '0121 444 3188',
    headteacher_name: 'Mr. Russell Bowen',
    headteacher_email: 'head@camphillboys.bham.sch.uk',
    office_email: 'enquiries@camphillboys.bham.sch.uk'
  },
  {
    urn: '103566',
    name: 'King Edward VI High School for Girls',
    phase: 'Secondary',
    type: 'Independent School',
    local_authority: 'Birmingham',
    address_line1: 'Edgbaston Park Road',
    town_city: 'Birmingham',
    postcode: 'B15 2UB',
    phone: '0121 472 1834',
    headteacher_name: 'Mrs. Kirsty von Malmborg',
    headteacher_email: 'headmistress@kehs.org.uk',
    office_email: 'admissions@kehs.org.uk'
  },
  {
    urn: '137832',
    name: 'Solihull Academy (PRU / Alternative Provision)',
    phase: 'Secondary',
    type: 'Alternative Provision Academy',
    local_authority: 'Solihull',
    address_line1: 'Little Park',
    town_city: 'Solihull',
    postcode: 'B90 4EU',
    phone: '0121 709 5420',
    headteacher_name: 'Mr. Stephen Steinhaus',
    headteacher_email: 'principal@solihullacademy.org',
    office_email: 'admin@solihullacademy.org'
  },
  {
    urn: '103409',
    name: 'Moor Hall Primary School',
    phase: 'Primary',
    type: 'Community School',
    local_authority: 'Birmingham',
    address_line1: 'Rowallan Road',
    town_city: 'Sutton Coldfield',
    postcode: 'B75 6RE',
    phone: '0121 675 3966',
    headteacher_name: 'Mrs. Christine Collett',
    headteacher_email: 'head@moorhall.bham.sch.uk',
    office_email: 'enquiry@moorhall.bham.sch.uk'
  },

  // Greater Manchester & North West
  {
    urn: '105574',
    name: 'The Manchester Grammar School',
    phase: 'All-through',
    type: 'Independent School',
    local_authority: 'Manchester',
    address_line1: 'Old Hall Lane',
    town_city: 'Manchester',
    postcode: 'M13 0XT',
    phone: '0161 224 7201',
    headteacher_name: 'Dr. Martin Boulton',
    headteacher_email: 'highmaster@mgs.org',
    office_email: 'reception@mgs.org'
  },
  {
    urn: '137941',
    name: 'Chorlton High School',
    phase: 'Secondary',
    type: 'Academy Converter',
    local_authority: 'Manchester',
    address_line1: 'Nell Lane',
    town_city: 'Chorlton, Manchester',
    postcode: 'M21 7SL',
    phone: '0161 882 1150',
    headteacher_name: 'Ms. Zoe Morris',
    headteacher_email: 'head@chorltonhigh.manchester.sch.uk',
    office_email: 'admin@chorltonhigh.manchester.sch.uk'
  },
  {
    urn: '105432',
    name: 'Didsbury CE Primary School',
    phase: 'Primary',
    type: 'Voluntary Aided School',
    local_authority: 'Manchester',
    address_line1: 'Elm Grove',
    town_city: 'Didsbury, Manchester',
    postcode: 'M20 6RL',
    phone: '0161 445 7144',
    headteacher_name: 'Mr. Matt Whitehead',
    headteacher_email: 'head@didsbury-ce.manchester.sch.uk',
    office_email: 'admin@didsbury-ce.manchester.sch.uk'
  },
  {
    urn: '106369',
    name: 'Altrincham Grammar School for Boys',
    phase: 'Secondary',
    type: 'Academy Converter (Grammar)',
    local_authority: 'Trafford',
    address_line1: 'Marlborough Road',
    town_city: 'Altrincham',
    postcode: 'WA14 2RS',
    phone: '0161 928 0858',
    headteacher_name: 'Mr. Graeme Wright',
    headteacher_email: 'headmaster@agsb.co.uk',
    office_email: 'agsboffice@agsb.co.uk'
  },
  {
    urn: '104677',
    name: 'Liverpool College',
    phase: 'All-through',
    type: 'Academy Converter',
    local_authority: 'Liverpool',
    address_line1: 'Queens Drive',
    town_city: 'Mossley Hill, Liverpool',
    postcode: 'L18 8BG',
    phone: '0151 724 4000',
    headteacher_name: 'Mr. Hans van Mourik Broekman',
    headteacher_email: 'principal@liverpoolcollege.org.uk',
    office_email: 'admin@liverpoolcollege.org.uk'
  },

  // Yorkshire (Leeds, Sheffield, York)
  {
    urn: '137258',
    name: 'Roundhay School',
    phase: 'All-through',
    type: 'Academy Converter',
    local_authority: 'Leeds',
    address_line1: 'Gledhow Lane',
    town_city: 'Leeds',
    postcode: 'LS8 1ND',
    phone: '0113 393 1200',
    headteacher_name: 'Mr. Matthew Partington',
    headteacher_email: 'headteacher@roundhayschool.com',
    office_email: 'contact@roundhayschool.com'
  },
  {
    urn: '108076',
    name: 'The Grammar School at Leeds',
    phase: 'All-through',
    type: 'Independent School',
    local_authority: 'Leeds',
    address_line1: 'Alwoodley Gates, Harrogate Road',
    town_city: 'Leeds',
    postcode: 'LS17 8GS',
    phone: '0113 229 1552',
    headteacher_name: 'Mrs. Susan Woodgate',
    headteacher_email: 'principal@gsal.org.uk',
    office_email: 'enquiries@gsal.org.uk'
  },
  {
    urn: '107127',
    name: 'Silverdale School',
    phase: 'Secondary',
    type: 'Academy Converter',
    local_authority: 'Sheffield',
    address_line1: 'Bents Crescent',
    town_city: 'Sheffield',
    postcode: 'S11 9QH',
    phone: '0114 236 9991',
    headteacher_name: 'Mrs. Sarah Sims',
    headteacher_email: 'head@silverdale.chorustrust.org',
    office_email: 'enquiries@silverdale.chorustrust.org'
  },

  // East Midlands, East of England & South
  {
    urn: '115372',
    name: 'Colchester Royal Grammar School',
    phase: 'Secondary',
    type: 'Academy Converter (Grammar)',
    local_authority: 'Essex',
    address_line1: 'Lexden Road',
    town_city: 'Colchester',
    postcode: 'CO3 3ND',
    phone: '01206 509100',
    headteacher_name: 'Mr. John Russell',
    headteacher_email: 'headmaster@crgs.co.uk',
    office_email: 'office@crgs.co.uk'
  },
  {
    urn: '110137',
    name: 'Eton College',
    phase: 'Secondary',
    type: 'Independent School',
    local_authority: 'Windsor and Maidenhead',
    address_line1: 'High Street',
    town_city: 'Windsor',
    postcode: 'SL4 6DW',
    phone: '01753 370100',
    headteacher_name: 'Mr. Simon Henderson',
    headteacher_email: 'headmaster@etoncollege.org.uk',
    office_email: 'reception@etoncollege.org.uk'
  },
  {
    urn: '102241',
    name: 'Harrow School',
    phase: 'Secondary',
    type: 'Independent School',
    local_authority: 'Harrow',
    address_line1: '5 High Street',
    town_city: 'Harrow on the Hill',
    postcode: 'HA1 3HP',
    phone: '020 8872 8000',
    headteacher_name: 'Mr. Alastair Land',
    headteacher_email: 'headmaster@harrowschool.org.uk',
    office_email: 'admissions@harrowschool.org.uk'
  },
  {
    urn: '118854',
    name: 'The Judd School, Tonbridge',
    phase: 'Secondary',
    type: 'Academy Converter (Grammar)',
    local_authority: 'Kent',
    address_line1: 'Brook Street',
    town_city: 'Tonbridge',
    postcode: 'TN9 2PN',
    phone: '01732 770880',
    headteacher_name: 'Mr. Damian McBeath',
    headteacher_email: 'head@judd.kent.sch.uk',
    office_email: 'enquiries@judd.kent.sch.uk'
  },
  {
    urn: '138865',
    name: 'Stamford Welland Academy',
    phase: 'Secondary',
    type: 'Academy Sponsor Led',
    local_authority: 'Lincolnshire',
    address_line1: 'Green Lane',
    town_city: 'Stamford',
    postcode: 'PE9 1HE',
    phone: '01780 761000',
    headteacher_name: 'Mrs. Vicky Lloyd',
    headteacher_email: 'head@stamfordwellandacademy.org',
    office_email: 'enquiries@stamfordwellandacademy.org'
  },
  {
    urn: '116524',
    name: 'Peter Symonds College',
    phase: '16-19',
    type: 'Sixth Form College',
    local_authority: 'Hampshire',
    address_line1: 'Owens Road',
    town_city: 'Winchester',
    postcode: 'SO22 6RX',
    phone: '01962 857500',
    headteacher_name: 'Mrs. Sara Russell',
    headteacher_email: 'principal@psc.ac.uk',
    office_email: 'admissions@psc.ac.uk'
  },

  // North East & Cumbria
  {
    urn: '108532',
    name: 'Royal Grammar School Newcastle',
    phase: 'All-through',
    type: 'Independent School',
    local_authority: 'Newcastle upon Tyne',
    address_line1: 'Eskdale Terrace, Jesmond',
    town_city: 'Newcastle upon Tyne',
    postcode: 'NE2 4DX',
    phone: '0191 281 5711',
    headteacher_name: 'Mr. Geoffrey Stanford',
    headteacher_email: 'head@rgs.newcastle.sch.uk',
    office_email: 'communications@rgs.newcastle.sch.uk'
  },
  {
    urn: '141088',
    name: 'Outwood Academy Bydales',
    phase: 'Secondary',
    type: 'Academy Sponsor Led',
    local_authority: 'Redcar and Cleveland',
    address_line1: 'Coast Road',
    town_city: 'Marske-by-the-Sea',
    postcode: 'TS11 6AR',
    phone: '01642 474000',
    headteacher_name: 'Mr. Rob Tarn',
    headteacher_email: 'principal@bydales.outwood.com',
    office_email: 'enquiries@bydales.outwood.com'
  }
];

async function run() {
  console.log('Connecting to Neon PostgreSQL to create and seed uk_schools_directory...');
  
  // 1. Create table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS uk_schools_directory (
      urn TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phase TEXT,
      type TEXT,
      local_authority TEXT,
      address_line1 TEXT,
      address_line2 TEXT,
      town_city TEXT,
      postcode TEXT,
      phone TEXT,
      headteacher_name TEXT,
      headteacher_email TEXT,
      office_email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_uk_schools_name ON uk_schools_directory (name);
    CREATE INDEX IF NOT EXISTS idx_uk_schools_postcode ON uk_schools_directory (postcode);
    CREATE INDEX IF NOT EXISTS idx_uk_schools_town ON uk_schools_directory (town_city);
  `);
  console.log('Table uk_schools_directory verified.');

  // 2. Insert schools with UPSERT
  let count = 0;
  for (const s of UK_SCHOOLS) {
    await pool.query(`
      INSERT INTO uk_schools_directory (
        urn, name, phase, type, local_authority, address_line1, address_line2, town_city,
        postcode, phone, headteacher_name, headteacher_email, office_email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (urn) DO UPDATE SET
        name = EXCLUDED.name,
        phase = EXCLUDED.phase,
        type = EXCLUDED.type,
        local_authority = EXCLUDED.local_authority,
        address_line1 = EXCLUDED.address_line1,
        address_line2 = EXCLUDED.address_line2,
        town_city = EXCLUDED.town_city,
        postcode = EXCLUDED.postcode,
        phone = EXCLUDED.phone,
        headteacher_name = EXCLUDED.headteacher_name,
        headteacher_email = EXCLUDED.headteacher_email,
        office_email = EXCLUDED.office_email
    `, [
      s.urn, s.name, s.phase, s.type, s.local_authority, s.address_line1, s.address_line2 || null,
      s.town_city, s.postcode, s.phone, s.headteacher_name, s.headteacher_email, s.office_email
    ]);
    count++;
  }

  console.log(`Successfully seeded ${count} UK schools into uk_schools_directory.`);
  await pool.end();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
