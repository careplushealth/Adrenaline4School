export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import fs from 'fs';
import path from 'path';

function getEnvVar(name: string): string | null {
  let val = process.env[name];
  if (!val) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(new RegExp(`${name}="([^"]+)"`)) || content.match(new RegExp(`${name}=([^\\r\\n]+)`));
        if (match) val = match[1].trim();
      }
    } catch (e) {
      // Ignore
    }
  }
  return val || null;
}

export async function GET() {
  const clientId = getEnvVar('GOOGLE_CLIENT_ID');
  const clientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');
  const refreshToken = getEnvVar('GOOGLE_REFRESH_TOKEN');
  const senderEmail = getEnvVar('GMAIL_SENDER_EMAIL') || 'adrenaline4schools@gmail.com';
  const resendKey = getEnvVar('RESEND_API_KEY');

  const diagnostics = {
    hasGoogleClientId: !!clientId,
    googleClientIdPreview: clientId ? `${clientId.slice(0, 15)}...` : 'MISSING',
    hasGoogleClientSecret: !!clientSecret,
    hasGoogleRefreshToken: !!refreshToken,
    senderEmail,
    hasResendApiKey: !!resendKey,
    environment: process.env.NODE_ENV || 'production',
    isLocalEnvFilePresent: fs.existsSync(path.join(process.cwd(), '.env.local')),
  };

  let tokenTest = 'not_attempted';
  if (clientId && clientSecret && refreshToken) {
    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        tokenTest = 'connected_and_valid';
      } else {
        tokenTest = `failed: ${data.error_description || data.error}`;
      }
    } catch (e: any) {
      tokenTest = `network_error: ${e.message}`;
    }
  } else {
    tokenTest = 'missing_environment_variables_on_host';
  }

  return NextResponse.json({
    success: true,
    diagnostics,
    tokenTest,
    message: tokenTest === 'connected_and_valid'
      ? 'Gmail API OAuth is fully authorized and ready to dispatch emails.'
      : 'Missing Google credentials in deployment environment variables.',
  });
}

export async function POST(req: Request) {
  try {
    const { to } = await req.json();
    const target = to || 'info@careplushealth.co.uk';

    const result = await sendEmail({
      to: target,
      subject: `Diagnostic Test Email - Adrenaline4Schools (${new Date().toLocaleTimeString('en-GB')})`,
      templateType: 'diagnostic_test',
      html: `
        <div style="font-family: -apple-system, sans-serif; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #09653d; margin-top: 0;">Diagnostic Email Delivery Test</h2>
          <p style="font-size: 14px; color: #334155;">
            This email was dispatched from the Adrenaline4Schools deployment server to verify delivery to Microsoft 365 / Outlook.
          </p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; font-size: 13px; color: #166534;">
            <strong>Status:</strong> Success &bull; Dispatched via Google Gmail API
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 16px;">
            Timestamp: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: result.success,
      result,
      target,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
