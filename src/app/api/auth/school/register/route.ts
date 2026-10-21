export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      schoolName,
      urn,
      postcode,
      contactName,
      email,
      password,
      headteacherName,
      jobTitle,
      phone,
    } = body;

    // Validate inputs
    if (!schoolName || !email || !password || !contactName) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields (School Name, Contact Name, Email, Password).' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid school email address.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.prepare('SELECT id, email, email_verified FROM users WHERE email = ?').get(cleanEmail) as any;
    if (existingUser) {
      if (existingUser.email_verified) {
        return NextResponse.json(
          { success: false, error: 'An account with this email address already exists. Please sign in.' },
          { status: 409 }
        );
      }
      // If user exists but unverified, generate a fresh code and update password
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await db.prepare('DELETE FROM auth_tokens WHERE user_id = ? AND type = ?').run(existingUser.id, 'email_verification');
      await db.prepare(`
        INSERT INTO auth_tokens (id, user_id, email, token, type, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(`tok-${Date.now()}`, existingUser.id, cleanEmail, verificationCode, 'email_verification', expiresAt);

      const newHash = hashPassword(password);
      await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, existingUser.id);

      // Dispatch real email
      await sendVerificationEmail({
        to: cleanEmail,
        code: verificationCode,
        schoolName: schoolName || 'Your School',
      });

      return NextResponse.json({
        success: true,
        userId: existingUser.id,
        email: cleanEmail,
        // Only include in response if no external mail service is configured (for smooth local test/dev)
        verificationCode: (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) ? verificationCode : undefined,
        message: 'A verification code has been dispatched to your school email address.',
      });
    }

    // 1. Create organisation & school record if needed
    const orgId = `org-${Date.now()}`;
    await db.prepare(`
      INSERT INTO organisations (id, name, type, billing_email, billing_phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(orgId, schoolName, 'Single School', cleanEmail, phone || '0800 123 4567');

    const schoolId = `sch-${Date.now()}`;
    await db.prepare(`
      INSERT INTO schools (
        id, organisation_id, urn, name, phase, address_line1, town_city, postcode,
        headteacher_name, headteacher_email, phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      schoolId,
      orgId,
      urn || '100000',
      schoolName,
      'Primary',
      'School Reception',
      'United Kingdom',
      postcode || 'SW1A 1AA',
      headteacherName || contactName,
      cleanEmail,
      phone || null
    );

    // 2. Create unverified user
    const userId = `usr-${Date.now()}`;
    const passwordHash = hashPassword(password);

    await db.prepare(`
      INSERT INTO users (
        id, organisation_id, school_id, name, email, password_hash, role,
        job_title, phone, is_active, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
    `).run(
      userId,
      orgId,
      schoolId,
      contactName,
      cleanEmail,
      passwordHash,
      'school_admin',
      jobTitle || 'School Allergy Lead',
      phone || null
    );

    // 3. Generate 6-digit verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.prepare(`
      INSERT INTO auth_tokens (id, user_id, email, token, type, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(`tok-${Date.now()}`, userId, cleanEmail, verificationCode, 'email_verification', expiresAt);

    // 4. Send official verification email
    await sendVerificationEmail({
      to: cleanEmail,
      code: verificationCode,
      schoolName,
    });

    return NextResponse.json({
      success: true,
      userId,
      email: cleanEmail,
      schoolName,
      verificationCode: (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) ? verificationCode : undefined,
      message: 'Account created! Please enter the 6-digit verification code sent to your official school email.',
    });
  } catch (error: any) {
    console.error('API Register Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred during registration.' },
      { status: 500 }
    );
  }
}
