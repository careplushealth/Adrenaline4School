export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateVerificationCode } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, code, newPassword } = body;

    const cleanEmail = (email || '').toLowerCase().trim();

    // 1. Request Reset Code
    if (action === 'request') {
      if (!cleanEmail) {
        return NextResponse.json({ success: false, error: 'School email is required.' }, { status: 400 });
      }

      const user = await db.prepare('SELECT id, name FROM users WHERE email = ?').get(cleanEmail) as any;
      if (!user) {
        // Return success even if not found to prevent user enumeration
        return NextResponse.json({
          success: true,
          message: 'If an account exists for this email, a reset code has been sent.',
        });
      }

      const resetCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await db.prepare('DELETE FROM auth_tokens WHERE user_id = ? AND type = ?').run(user.id, 'password_reset');
      await db.prepare(`
        INSERT INTO auth_tokens (id, user_id, email, token, type, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(`tok-${Date.now()}`, user.id, cleanEmail, resetCode, 'password_reset', expiresAt);

      return NextResponse.json({
        success: true,
        resetCode, // displayed for easy testing/demo
        message: 'Password reset code generated and sent to school email.',
      });
    }

    // 2. Confirm and Change Password
    if (action === 'confirm') {
      if (!cleanEmail || !code || !newPassword) {
        return NextResponse.json({ success: false, error: 'Email, reset code, and new password are required.' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, error: 'New password must be at least 8 characters.' }, { status: 400 });
      }

      const tokenRecord = await db.prepare(`
        SELECT * FROM auth_tokens 
        WHERE email = ? AND token = ? AND type = 'password_reset'
        ORDER BY created_at DESC LIMIT 1
      `).get(cleanEmail, code.toString().trim()) as any;

      if (!tokenRecord || new Date(tokenRecord.expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: 'Invalid or expired password reset code.' }, { status: 400 });
      }

      const newHash = hashPassword(newPassword);
      await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, tokenRecord.user_id);
      await db.prepare('DELETE FROM auth_tokens WHERE id = ?').run(tokenRecord.id);

      return NextResponse.json({
        success: true,
        message: 'Password has been updated successfully! You can now log in.',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
