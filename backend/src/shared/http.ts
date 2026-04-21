import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getEnv } from './env';

function resolveAllowedOrigin(originHeader?: string): string {
  const env = getEnv();
  const configuredOrigins = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (configuredOrigins.length === 0) {
    return originHeader ?? '*';
  }

  if (originHeader && configuredOrigins.includes(originHeader)) {
    return originHeader;
  }

  return configuredOrigins[0]!;
}

export function applyCorsHeaders(req: VercelRequest, res: VercelResponse): void {
  const origin = resolveAllowedOrigin(req.headers.origin);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
}

export function appendSetCookieHeader(res: VercelResponse, cookie: string): void {
  const current = res.getHeader('Set-Cookie');

  if (!current) {
    res.setHeader('Set-Cookie', cookie);
    return;
  }

  if (Array.isArray(current)) {
    res.setHeader('Set-Cookie', [...current, cookie]);
    return;
  }

  res.setHeader('Set-Cookie', [String(current), cookie]);
}

export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  applyCorsHeaders(req, res);

  if (req.method !== 'OPTIONS') {
    return false;
  }

  res.status(204).end();
  return true;
}

export function methodNotAllowed(req: VercelRequest, res: VercelResponse, allowed: string[]): void {
  applyCorsHeaders(req, res);
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ error: 'Method not allowed' });
}

export function jsonResponse(
  req: VercelRequest,
  res: VercelResponse,
  statusCode: number,
  payload: unknown,
): void {
  applyCorsHeaders(req, res);
  res.status(statusCode).json(payload);
}

export function validationError(req: VercelRequest, res: VercelResponse, details: unknown): void {
  jsonResponse(req, res, 400, {
    error: 'Validation failed',
    details,
  });
}

export function unauthorized(req: VercelRequest, res: VercelResponse): void {
  jsonResponse(req, res, 401, { error: 'Unauthorized' });
}

export function notFound(req: VercelRequest, res: VercelResponse, message = 'Resource not found'): void {
  jsonResponse(req, res, 404, { error: message });
}

export function conflict(req: VercelRequest, res: VercelResponse, message: string): void {
  jsonResponse(req, res, 409, { error: message });
}

export function internalServerError(req: VercelRequest, res: VercelResponse): void {
  jsonResponse(req, res, 500, { error: 'Internal server error' });
}
