import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getGoogleClientId(): string | null {
  let clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/GOOGLE_CLIENT_ID="([^"]+)"/) || content.match(/GOOGLE_CLIENT_ID=([^\r\n]+)/);
        if (match) clientId = match[1].trim();
      }
    } catch (e) {
      // Ignore
    }
  }
  return clientId || null;
}

export async function GET(request: Request) {
  const clientId = getGoogleClientId();
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not set' }, { status: 400 });
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/callback/google`;

  const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}
