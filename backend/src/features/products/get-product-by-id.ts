import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { prisma } from '../../shared/db';
import {
  handlePreflight,
  internalServerError,
  jsonResponse,
  methodNotAllowed,
  validationError,
} from '../../shared/http';
import { parseWithZod } from '../../shared/validation';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function getProductById(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  try {
    const parsedParams = parseWithZod(paramsSchema, req.query);

    if (!parsedParams.success) {
      validationError(req, res, parsedParams.details);
      return;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parsedParams.data.id,
      },
      include: {
        medias: {
          orderBy: {
            order: 'asc',
          },
        },
        productTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        affiliateLinks: true,
      },
    });

    if (!product) {
      jsonResponse(req, res, 404, { error: 'Product not found' });
      return;
    }

    jsonResponse(req, res, 200, {
      id: product.id,
      name: product.name,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      medias: product.medias,
      tags: product.productTags.map((productTag) => productTag.tag),
      affiliateLinks: product.affiliateLinks,
    });
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}
