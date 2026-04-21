import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { conflict, internalServerError, notFound, validationError } from '../../shared/http';
import { resolveRouteParam } from '../../shared/route-params';
import { parseWithZod, readJsonBody } from '../../shared/validation';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const payloadSchema = z.object({
  platform: z.string().trim().min(1).max(80),
  url: z.string().trim().url(),
});

export async function updateAffiliateLink(req: VercelRequest, res: VercelResponse): Promise<void> {
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

    const id = parsedParams.data.id;
    const current = await prisma.affiliateLink.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
      },
    });
    if (!current) {
      notFound(req, res, 'Affiliate link not found');
      return;
    }

    const duplicate = await prisma.affiliateLink.findFirst({
      where: {
        id: { not: id },
        productId: current.productId,
        platform: parsedBody.data.platform,
        url: parsedBody.data.url,
      },
      select: {
        id: true,
      },
    });
    if (duplicate) {
      conflict(req, res, 'Link afiliado duplicado para este produto.');
      return;
    }

    await prisma.affiliateLink.update({
      where: { id },
      data: parsedBody.data,
    });

    res.status(204).end();
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

