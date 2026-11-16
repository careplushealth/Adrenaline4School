import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;"><h2>Google Auth Error</h2><p>${error}</p></body></html>`,
      { headers: { 'content-type': 'text/html' }, status: 400 }
    );
  }

  if (!code) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;"><h2>No code provided</h2></body></html>`,
      { headers: { 'content-type': 'text/html' }, status: 400 }
    );
  }

  const clientId = getEnvVar('GOOGLE_CLIENT_ID');
  const clientSecret = getEnvVar('GOOGLE_CLIENT_SECRET');
  const redirectUri = `${origin}/api/auth/callback/google`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      return new Response(
        `<html><body style="font-family:sans-serif;padding:40px;"><h2>Token Exchange Error</h2><p>${tokens.error_description || tokens.error}</p><pre>${JSON.stringify(
          tokens,
          null,
          2
        )}</pre></body></html>`,
        { headers: { 'content-type': 'text/html' }, status: 400 }
      );
    }

    const refreshToken = tokens.refresh_token;

    // Save refresh token into .env.local automatically
    if (refreshToken) {
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
            envContent = envContent.replace(/GOOGLE_REFRESH_TOKEN=.*/g, `GOOGLE_REFRESH_TOKEN="${refreshToken}"`);
          } else {
            envContent += `\nGOOGLE_REFRESH_TOKEN="${refreshToken}"\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
        }
      } catch (e) {
        console.error('Failed to update .env.local:', e);
      }
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Google Gmail API Authorization</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: white; border-radius: 24px; padding: 36px; max-width: 580px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.08); text-align: center; }
            h1 { color: #09653d; margin-top: 10px; font-size: 22px; }
            p { color: #475569; font-size: 14px; line-height: 1.6; }
            .token-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 11px; word-break: break-all; margin: 20px 0; color: #0f172a; text-align: left; }
            .badge { display: inline-block; background: #ecfdf5; color: #09653d; padding: 4px 14px; border-radius: 999px; font-weight: 600; font-size: 12px; }
            .btn { display: inline-block; background: #09653d; color: white; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">&#10003; Gmail API Connected</span>
            <h1>Gmail Sending Authorized!</h1>
            <p><strong>Adrenaline4schools@gmail.com</strong> is now authorized to dispatch verification codes and order confirmations directly through Google's authentic mail servers.</p>
            ${
              refreshToken
                ? `<p style="font-size: 12px; color: #64748b;">Refresh Token captured and saved automatically to .env.local:</p><div class="token-box">${refreshToken}</div>`
                : '<p style="color:#d97706; font-size: 13px;">Authorization successful. The refresh token was previously generated and is stored.</p>'
            }
            <a href="/" class="btn">Return to Website</a>
          </div>
        </body>
      </html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  } catch (err: any) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;"><h2>Exchange Exception</h2><p>${err.message}</p></body></html>`,
      { headers: { 'content-type': 'text/html' }, status: 500 }
    );
  }
}
