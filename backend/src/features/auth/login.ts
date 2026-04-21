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

export async function login(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST', 'OPTIONS']);
    return;
  }

  try {
    const body = await readJsonBody(req);
    const parsedBody = parseWithZod(loginSchema, body);

    if (parsedBody.success === false) {
      validationError(req, res, parsedBody.details);
      return;
    }

    const normalizedEmail = parsedBody.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    if (!user) {
      unauthorized(req, res);
      return;
    }

    const passwordMatches = await verifyPassword(parsedBody.data.password, user.passwordHash);
    if (!passwordMatches) {
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

    jsonResponse(req, res, 200, {
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}
