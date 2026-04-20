import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { signAccessToken, verifyPassword } from '../../shared/auth';
import { prisma } from '../../shared/db';
import {
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

    if (!parsedBody.success) {
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

    jsonResponse(req, res, 200, {
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}
