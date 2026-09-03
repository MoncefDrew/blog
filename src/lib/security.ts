/**
 * Cryptographic security, rate limiting, and input sanitization utilities.
 * Uses the standard Web Crypto API (supported natively in all modern browsers).
 */

const APP_SALT = 'daemon_abyss_secure_salt_2026';

// -----------------------------------------------------------------------------
// 1. Cryptographic Password Hashing (PBKDF2 + SHA-256, 100,000 iterations)
// -----------------------------------------------------------------------------

export async function hashPassword(password: string, salt: string = APP_SALT): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', derivedKey);
  const hashArray = Array.from(new Uint8Array(exported));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
  attempt: string,
  storedOrExpectedHash: string,
  salt: string = APP_SALT
): Promise<boolean> {
  try {
    const attemptHash = await hashPassword(attempt, salt);
    // Constant-time string comparison to prevent timing attacks
    if (attemptHash.length !== storedOrExpectedHash.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < attemptHash.length; i++) {
      result |= attemptHash.charCodeAt(i) ^ storedOrExpectedHash.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// 2. Persistent Client-Side Rate Limiter
// -----------------------------------------------------------------------------

interface RateLimitRecord {
  count: number;
  firstAttemptTime: number;
  lockoutUntil?: number;
}

const STORAGE_PREFIX = 'rate_limit_';

function getRecord(key: string): RateLimitRecord | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setRecord(key: string, record: RateLimitRecord) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(record));
  } catch {
    // ignore
  }
}

/**
 * Check and enforce rate limits.
 * @param key unique identifier for action (e.g. 'login_moncef', 'upload_image')
 * @param maxAttempts maximum allowed actions within window
 * @param windowMs time window in milliseconds
 * @param lockoutDurationMs lockout time if exceeded
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000, // 15 mins
  lockoutDurationMs = 15 * 60 * 1000 // 15 mins
): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = getRecord(key);

  if (!record) {
    return { allowed: true };
  }

  // If currently locked out
  if (record.lockoutUntil && record.lockoutUntil > now) {
    const waitSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // If window expired, reset
  if (now - record.firstAttemptTime > windowMs) {
    sessionStorage.removeItem(STORAGE_PREFIX + key);
    return { allowed: true };
  }

  // If attempt limit reached
  if (record.count >= maxAttempts) {
    const lockoutUntil = now + lockoutDurationMs;
    setRecord(key, { ...record, lockoutUntil });
    return { allowed: false, waitSeconds: Math.ceil(lockoutDurationMs / 1000) };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = getRecord(key);

  if (!record || now - record.firstAttemptTime > windowMs) {
    setRecord(key, { count: 1, firstAttemptTime: now });
  } else {
    setRecord(key, { ...record, count: record.count + 1 });
  }
}

export function resetRateLimit(key: string) {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // ignore
  }
}

// -----------------------------------------------------------------------------
// 3. Input Sanitization and Validation
// -----------------------------------------------------------------------------

export function sanitizeTitle(raw: string): string {
  return raw.replace(/[<>]/g, '').trim().slice(0, 160);
}

export function sanitizeAuthor(raw: string): string {
  return raw.replace(/[<>]/g, '').trim().slice(0, 80);
}

export function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function validateImageFile(file: File, maxSizeBytes = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type}). Allowed: JPG, PNG, WEBP, GIF.`,
    };
  }
  if (file.size > maxSizeBytes) {
    const mb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is ${mb}MB.`,
    };
  }
  return { valid: true };
}
