export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const item = await db.prepare('SELECT * FROM cms_content WHERE key = ?').get(key);
      return NextResponse.json({ success: true, item });
    }

    const items = await db.prepare('SELECT * FROM cms_content ORDER BY section ASC').all();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, title, section, contentJson } = body;

    await db.prepare(`
      INSERT OR REPLACE INTO cms_content (key, title, section, content_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(key, title, section, typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson));

    return NextResponse.json({ success: true, message: 'Content updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
