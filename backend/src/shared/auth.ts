import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getEnv } from './env';
import { unauthorized } from './http';

const ACCESS_TOKEN_COOKIE = 'xavier_access_token';
const SWAGGER_TOKEN_COOKIE = 'xavier_swagger_token';
let bcryptModulePromise: Promise<typeof import('bcryptjs')> | null = null;
let joseModulePromise: Promise<typeof import('jose')> | null = null;

export type AuthPayload = {
  userId: string;
  email: string;
};

async function ensureWebCrypto(): Promise<void> {
  if (typeof globalThis.crypto !== 'undefined') {
    return;
  }

  const cryptoModule = await import('node:crypto');
  if (!cryptoModule.webcrypto) {
    throw new Error('WebCrypto API is not available in this runtime.');
  }

  (globalThis as { crypto?: unknown }).crypto = cryptoModule.webcrypto;
}

async function getBcryptModule(): Promise<typeof import('bcryptjs')> {
  if (!bcryptModulePromise) {
    bcryptModulePromise = import('bcryptjs');
  }

  return bcryptModulePromise;
}

async function getJoseModule(): Promise<typeof import('jose')> {
  await ensureWebCrypto();
  if (!joseModulePromise) {
    joseModulePromise = import('jose');
  }

  return joseModulePromise;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await getBcryptModule();
  const bcryptAny = bcrypt as unknown as {
    compare?: (plain: string, hashed: string) => Promise<boolean>;
    default?: { compare?: (plain: string, hashed: string) => Promise<boolean> };
  };
  const compare =
    typeof bcryptAny.compare === 'function'
      ? bcryptAny.compare.bind(bcryptAny)
      : typeof bcryptAny.default?.compare === 'function'
        ? bcryptAny.default.compare.bind(bcryptAny.default)
        : null;

  if (!compare) {
    throw new Error('bcrypt compare function is unavailable in current runtime.');
  }

  return compare(password, hash);
}

export async function signAccessToken(payload: AuthPayload): Promise<{ token: string; expiresAt: Date }> {
  const { SignJWT } = await getJoseModule();
  const env = getEnv();
  const expiresAt = new Date(Date.now() + env.JWT_EXPIRATION_MINUTES * 60 * 1000);
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const token = await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret);

  return { token, expiresAt };
}

function extractBearerToken(req: VercelRequest): string | null {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

function extractTokenFromCookies(req: VercelRequest): string | null {
  const rawCookies = req.headers.cookie;

  if (!rawCookies) {
    return null;
  }

  const cookies = rawCookies.split(';');
  const parsedCookies = new Map<string, string>();

  for (const cookieEntry of cookies) {
    const separatorIndex = cookieEntry.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = cookieEntry.slice(0, separatorIndex).trim();
    const value = cookieEntry.slice(separatorIndex + 1).trim();
    parsedCookies.set(key, decodeURIComponent(value));
  }

  return parsedCookies.get(ACCESS_TOKEN_COOKIE) ?? parsedCookies.get(SWAGGER_TOKEN_COOKIE) ?? null;
}

export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
): Promise<AuthPayload | null> {
  const { jwtVerify } = await getJoseModule();
  const token = extractBearerToken(req) ?? extractTokenFromCookies(req);

  if (!token) {
    unauthorized(req, res);
    return null;
  }

  try {
    const env = getEnv();
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const verified = await jwtVerify(token, secret, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    if (!verified.payload.sub || typeof verified.payload.email !== 'string') {
      unauthorized(req, res);
      return null;
    }

    return {
      userId: verified.payload.sub,
      email: verified.payload.email,
    };
  } catch {
    unauthorized(req, res);
    return null;
  }
}
