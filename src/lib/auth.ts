import crypto from 'crypto';

/**
 * Hash a password securely with salt using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored hash or demo hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // Convenience for seed demo users
  if (storedHash === '$2a$10$demoHash' || storedHash === 'demoHash') {
    if (password === 'school2026' || password === 'admin2026' || password === 'adrenaline2026') {
      return true;
    }
  }

  // Salted PBKDF2 hash check
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) {
    return password === storedHash;
  }

  const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hashToVerify === originalHash;
}

/**
 * Generate a 6-digit numeric verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a secure random token for links/sessions
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
