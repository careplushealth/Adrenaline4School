export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    let query = `
      SELECT 
        s.*,
        org.name as organisation_name,
        org.type as organisation_type,
        (SELECT count(*) FROM orders WHERE school_id = s.id) as orders_count,
        (SELECT count(*) FROM school_supply_records WHERE school_id = s.id AND status != 'replaced') as active_pens_count
      FROM schools s
      JOIN organisations org ON s.organisation_id = org.id
    `;
    const params: any[] = [];

    if (orgId) {
      query += ' WHERE s.organisation_id = ?';
      params.push(orgId);
    }

    query += ' ORDER BY s.name ASC';

    const schools = await db.prepare(query).all(...params);
    const organisations = await db.prepare('SELECT * FROM organisations ORDER BY name ASC').all();

    return NextResponse.json({ success: true, schools, organisations });
  } catch (error: any) {
    console.error('API GET /schools error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      organisationId,
      name,
      urn,
      phase,
      addressLine1,
      addressLine2,
      townCity,
      postcode,
      headteacherName,
      headteacherEmail,
      designatedAllergyLead,
      phone,
    } = body;

    const id = `sch-${Date.now()}`;
    await db.prepare(`
      INSERT INTO schools (
        id, organisation_id, urn, name, phase, address_line1, address_line2, town_city, postcode,
        headteacher_name, headteacher_email, designated_allergy_lead, phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, organisationId, urn, name, phase || 'Primary', addressLine1, addressLine2 || null,
      townCity, postcode, headteacherName, headteacherEmail, designatedAllergyLead || null, phone || null
    );

    return NextResponse.json({ success: true, id, message: 'School profile created successfully' });
  } catch (error: any) {
    console.error('API POST /schools error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
