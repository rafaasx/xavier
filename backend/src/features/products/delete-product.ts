import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { internalServerError, notFound, validationError } from '../../shared/http';
import { resolveRouteParam } from '../../shared/route-params';
import { parseWithZod } from '../../shared/validation';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteProduct(req: VercelRequest, res: VercelResponse): Promise<void> {
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

    const deleted = await prisma.product.deleteMany({
      where: { id: parsedParams.data.id },
    });

    if (deleted.count === 0) {
      notFound(req, res, 'Product not found');
      return;
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

