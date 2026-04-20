import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import {
  handlePreflight,
  internalServerError,
  jsonResponse,
  methodNotAllowed,
  unauthorized,
} from '../../shared/http';

export async function me(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  try {
    const authPayload = await requireAuth(req, res);
    if (!authPayload) {
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authPayload.userId,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      unauthorized(req, res);
      return;
    }

    jsonResponse(req, res, 200, user);
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}
