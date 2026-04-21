import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { conflict, internalServerError, notFound, validationError } from '../../shared/http';
import { resolveRouteParam } from '../../shared/route-params';
import { parseWithZod } from '../../shared/validation';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteTag(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const authPayload = await requireAuth(req, res);
    if (!authPayload) {
      return;
    }

    const parsedParams = parseWithZod(paramsSchema, { id: resolveRouteParam(req, 'id') });
    if (parsedParams.success === false) {
      validationError(req, res, parsedParams.details);
      return;
    }

    const tagId = parsedParams.data.id;
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      select: { id: true },
    });

    if (!tag) {
      notFound(req, res, 'Tag not found');
      return;
    }

    const linkedProductsCount = await prisma.productTag.count({
      where: { tagId },
    });
    if (linkedProductsCount > 0) {
      conflict(req, res, 'Tag associada a produtos não pode ser removida.');
      return;
    }

    await prisma.tag.delete({
      where: { id: tagId },
    });

    res.status(204).end();
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

