import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || 'Adren@line#Secure2026!';

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 });
    }

    // Constant-time comparison to prevent timing attacks
    const passwordBuffer = Buffer.from(password.trim());
    const expectedBuffer = Buffer.from(expectedPassword.trim());

    if (passwordBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(passwordBuffer, expectedBuffer)) {
      return NextResponse.json({ success: false, error: 'Invalid authorization passphrase' }, { status: 401 });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({
      success: true,
      token,
      message: 'Authenticated successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
