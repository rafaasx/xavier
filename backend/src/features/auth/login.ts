import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { signAccessToken, verifyPassword } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { getEnv } from '../../shared/env';
import {
  appendSetCookieHeader,
  handlePreflight,
  internalServerError,
  jsonResponse,
  methodNotAllowed,
  unauthorized,
  validationError,
} from '../../shared/http';
import { parseWithZod, readJsonBody } from '../../shared/validation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function resolveRequestId(req: VercelRequest): string {
  const vercelId = req.headers['x-vercel-id'];
  if (typeof vercelId === 'string' && vercelId.trim().length > 0) {
    return vercelId;
  }

  return 'local-dev';
}

function maskEmail(email: string): string {
  const [localPart, domainPart] = email.split('@');
  if (!localPart || !domainPart) {
    return 'invalid-email';
  }

  if (localPart.length <= 2) {
    return `**@${domainPart}`;
  }

  return `${localPart.slice(0, 2)}***@${domainPart}`;
}

export async function login(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST', 'OPTIONS']);
    return;
  }

  const requestId = resolveRequestId(req);

  try {
    console.info('[auth/login] Request received', { requestId });
    const body = await readJsonBody(req);
    const parsedBody = parseWithZod(loginSchema, body);

    if (parsedBody.success === false) {
      console.warn('[auth/login] Validation failed', {
        requestId,
        fieldErrors: Object.keys(parsedBody.details.fieldErrors ?? {}),
      });
      validationError(req, res, parsedBody.details);
      return;
    }

    const normalizedEmail = parsedBody.data.email.trim().toLowerCase();
    const safeEmail = maskEmail(normalizedEmail);
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    if (!user) {
      console.warn('[auth/login] User not found', { requestId, email: safeEmail });
      unauthorized(req, res);
      return;
    }

    const passwordMatches = await verifyPassword(parsedBody.data.password, user.passwordHash);
    if (!passwordMatches) {
      console.warn('[auth/login] Invalid password', {
        requestId,
        userId: user.id,
        email: safeEmail,
      });
      unauthorized(req, res);
      return;
    }

    const { token, expiresAt } = await signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const env = getEnv();
    const maxAgeSeconds = env.JWT_EXPIRATION_MINUTES * 60;
    const isHttps = req.headers['x-forwarded-proto'] === 'https';
    const cookieSecuritySuffix = isHttps ? '; Secure' : '';

    appendSetCookieHeader(
      res,
      `xavier_access_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; HttpOnly${cookieSecuritySuffix}`,
    );

    appendSetCookieHeader(
      res,
      `xavier_swagger_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${cookieSecuritySuffix}`,
    );

    console.info('[auth/login] Login succeeded', {
      requestId,
      userId: user.id,
      email: safeEmail,
    });

    jsonResponse(req, res, 200, {
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[auth/login] Unexpected error', {
      requestId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    internalServerError(req, res);
  }
}
