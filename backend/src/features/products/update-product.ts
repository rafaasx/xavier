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
  name: z.string().trim().min(3).max(120),
  shortDescription: z.string().trim().min(1).max(240),
  longDescription: z.string().trim().min(1),
  tagIds: z.array(z.string().uuid()).optional().default([]).transform((items) => Array.from(new Set(items))),
});

export async function updateProduct(req: VercelRequest, res: VercelResponse): Promise<void> {
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

    const body = await readJsonBody(req);
    const parsedBody = parseWithZod(payloadSchema, body);
    if (parsedBody.success === false) {
      validationError(req, res, parsedBody.details);
      return;
    }

    const productId = parsedParams.data.id;
    const tagIds = parsedBody.data.tagIds;
    if (tagIds.length > 0) {
      const existingTags = await prisma.tag.count({
        where: {
          id: {
            in: tagIds,
          },
        },
      });

      if (existingTags !== tagIds.length) {
        validationError(req, res, {
          formErrors: [],
          fieldErrors: {
            tagIds: ['Uma ou mais tags não existem.'],
          },
        });
        return;
      }
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!existingProduct) {
      notFound(req, res, 'Product not found');
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name: parsedBody.data.name,
          shortDescription: parsedBody.data.shortDescription,
          longDescription: parsedBody.data.longDescription,
        },
      });

      await tx.productTag.deleteMany({
        where: { productId },
      });

      if (tagIds.length > 0) {
        await tx.productTag.createMany({
          data: tagIds.map((tagId) => ({ productId, tagId })),
        });
      }
    });

    res.status(204).end();
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

