export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Look up user
    const user = await db.prepare(`
      SELECT 
        u.*,
        s.id as school_id, s.name as school_name, s.urn, s.postcode, s.town_city, s.headteacher_name,
        org.id as organisation_id, org.name as organisation_name
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN organisations org ON s.organisation_id = org.id
      WHERE LOWER(u.email) = ?
    `).get(cleanEmail) as any;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid school email or password.' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'This account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid school email or password.' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json({
        success: false,
        requiresVerification: true,
        email: cleanEmail,
        error: 'Please verify your school email address before accessing the portal.',
      }, { status: 403 });
    }

    // Safe user object (remove password hash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      jobTitle: user.job_title,
      schoolId: user.school_id,
      schoolName: user.school_name,
      urn: user.urn,
      postcode: user.postcode,
      townCity: user.town_city,
      headteacherName: user.headteacher_name,
      organisationId: user.organisation_id,
      organisationName: user.organisation_name,
    };

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      user: safeUser,
    });
  } catch (error: any) {
    console.error('API Login Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
