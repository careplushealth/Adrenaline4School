export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const token = params.token;
    const supply = db.prepare(`
      SELECT 
        sup.*,
        s.name as school_name,
        s.urn as school_urn,
        s.address_line1,
        s.address_line2,
        s.town_city,
        s.postcode,
        s.headteacher_name,
        s.headteacher_email,
        s.phone,
        p.id as product_id,
        p.name as product_name,
        p.strength,
        p.pack_size,
        p.price,
        p.requires_headteacher_requisition,
        org.name as organisation_name,
        org.billing_email
      FROM school_supply_records sup
      JOIN schools s ON sup.school_id = s.id
      JOIN products p ON sup.product_id = p.id
      JOIN organisations org ON s.organisation_id = org.id
      WHERE sup.reorder_token = ?
    `).get(token) as any;

    if (!supply) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reorder link' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      supply,
    });
  } catch (error: any) {
    console.error('API GET /reorder/[token] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
