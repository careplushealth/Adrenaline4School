export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    // Find token
    const tokenRecord = await db.prepare(`
      SELECT * FROM auth_tokens 
      WHERE email = ? AND token = ? AND type = 'email_verification'
      ORDER BY created_at DESC LIMIT 1
    `).get(cleanEmail, cleanCode) as any;

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please check your email or request a new code.' },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark user as email_verified
    await db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(tokenRecord.user_id);

    // Delete used token
    await db.prepare('DELETE FROM auth_tokens WHERE id = ?').run(tokenRecord.id);

    // Get user and school info to return
    const user = await db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.role, u.job_title, u.phone,
        s.id as school_id, s.name as school_name, s.urn, s.postcode, s.town_city, s.headteacher_name,
        org.id as organisation_id, org.name as organisation_name
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN organisations org ON s.organisation_id = org.id
      WHERE u.id = ?
    `).get(tokenRecord.user_id) as any;

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified! Welcome to your School Allergy Portal.',
      user,
    });
  } catch (error: any) {
    console.error('API Verify Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred during verification.' },
      { status: 500 }
    );
  }
}
