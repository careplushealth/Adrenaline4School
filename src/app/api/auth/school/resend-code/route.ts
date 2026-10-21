export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.prepare('SELECT u.id, u.name, s.name as school_name FROM users u LEFT JOIN schools s ON u.school_id = s.id WHERE u.email = ?').get(cleanEmail) as any;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Account not found.' }, { status: 404 });
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.prepare('DELETE FROM auth_tokens WHERE user_id = ? AND type = ?').run(user.id, 'email_verification');
    await db.prepare(`
      INSERT INTO auth_tokens (id, user_id, email, token, type, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`tok-${Date.now()}`, user.id, cleanEmail, code, 'email_verification', expiresAt);

    // Send real email
    await sendVerificationEmail({
      to: cleanEmail,
      code,
      schoolName: user.school_name || 'Your School',
    });

    return NextResponse.json({
      success: true,
      verificationCode: (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) ? code : undefined,
      message: 'A fresh 6-digit verification code has been dispatched to your school inbox.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
