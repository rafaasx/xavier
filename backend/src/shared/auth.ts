import type { VercelRequest, VercelResponse } from '@vercel/node';
import { webcrypto } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

import { getEnv } from './env';
import { unauthorized } from './http';

const ACCESS_TOKEN_COOKIE = 'xavier_access_token';
const SWAGGER_TOKEN_COOKIE = 'xavier_swagger_token';

export type AuthPayload = {
  userId: string;
  email: string;
};

function ensureWebCrypto(): void {
  if (typeof globalThis.crypto === 'undefined') {
    (globalThis as { crypto?: unknown }).crypto = webcrypto;
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAccessToken(payload: AuthPayload): Promise<{ token: string; expiresAt: Date }> {
  ensureWebCrypto();
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
  ensureWebCrypto();
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
