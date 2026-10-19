export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const strength = searchParams.get('strength');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM products WHERE is_available = 1';
    const params: any[] = [];

    if (brand && brand !== 'all') {
      query += ' AND brand = ?';
      params.push(brand);
    }

    if (strength && strength !== 'all') {
      query += ' AND strength LIKE ?';
      params.push(`%${strength}%`);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY display_order ASC';

    const products = db.prepare(query).all(...params);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('API /products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
