import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { internalServerError, notFound, validationError } from '../../shared/http';
import { resolveRouteParam } from '../../shared/route-params';
import { parseWithZod, readJsonBody } from '../../shared/validation';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const payloadSchema = z.object({
  url: z.string().trim().url(),
  type: z.enum(['IMAGE', 'YOUTUBE', 'INSTAGRAM', 'VIDEO']),
  aspectRatio: z.enum(['RATIO_16_9', 'RATIO_9_16']),
  order: z.coerce.number().int().min(0),
});

export async function updateMedia(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const authPayload = await requireAuth(req, res);
    if (!authPayload) {
      return;
    }

    const parsedParams = parseWithZod(paramsSchema, { id: resolveRouteParam(req, 'id') });
    if (!parsedParams.success) {
      validationError(req, res, parsedParams.details);
      return;
    }

    const body = await readJsonBody(req);
    const parsedBody = parseWithZod(payloadSchema, body);
    if (!parsedBody.success) {
      validationError(req, res, parsedBody.details);
      return;
    }

    const updated = await prisma.media.updateMany({
      where: { id: parsedParams.data.id },
      data: parsedBody.data,
    });

    if (updated.count === 0) {
      notFound(req, res, 'Media not found');
      return;
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

