export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const phase = searchParams.get('phase');
    const limit = Math.min(250, parseInt(searchParams.get('limit') || '50', 10));

    let sql = 'SELECT * FROM uk_schools_directory WHERE 1=1';
    const params: any[] = [];

    if (phase && phase !== 'all') {
      sql += ' AND (phase ILIKE ? OR type ILIKE ?)';
      params.push(`%${phase}%`, `%${phase}%`);
    }

    if (query) {
      const searchPattern = `%${query}%`;
      sql += ' AND (name ILIKE ? OR postcode ILIKE ? OR urn ILIKE ? OR town_city ILIKE ? OR local_authority ILIKE ?)';
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY name ASC LIMIT ?';
    params.push(limit);

    const results = await db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, schools: results });
  } catch (error: any) {
    console.error('API /api/schools/search error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
