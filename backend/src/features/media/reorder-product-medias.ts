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

const itemSchema = z.object({
  mediaId: z.string().uuid(),
  order: z.coerce.number().int().min(0),
});

const payloadSchema = z.object({
  items: z.array(itemSchema).min(1),
});

export async function reorderProductMedias(req: VercelRequest, res: VercelResponse): Promise<void> {
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

    const productId = parsedParams.data.id;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      notFound(req, res, 'Product not found');
      return;
    }

    const mediaIds = parsedBody.data.items.map((item) => item.mediaId);
    const distinctMediaIds = new Set(mediaIds);
    if (distinctMediaIds.size !== mediaIds.length) {
      validationError(req, res, {
        formErrors: [],
        fieldErrors: {
          items: ['Não é permitido repetir mediaId na mesma operação.'],
        },
      });
      return;
    }

    const orders = parsedBody.data.items.map((item) => item.order);
    const distinctOrders = new Set(orders);
    if (distinctOrders.size !== orders.length) {
      validationError(req, res, {
        formErrors: [],
        fieldErrors: {
          items: ['Não é permitido repetir order na mesma operação.'],
        },
      });
      return;
    }

    const medias = await prisma.media.findMany({
      where: {
        id: { in: mediaIds },
        productId,
      },
      select: {
        id: true,
      },
    });

    if (medias.length !== mediaIds.length) {
      validationError(req, res, {
        formErrors: ['Há mídias inexistentes ou que não pertencem ao produto informado.'],
        fieldErrors: {},
      });
      return;
    }

    await prisma.$transaction(
      parsedBody.data.items.map((item) =>
        prisma.media.update({
          where: { id: item.mediaId },
          data: { order: item.order },
        }),
      ),
    );

    res.status(204).end();
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

