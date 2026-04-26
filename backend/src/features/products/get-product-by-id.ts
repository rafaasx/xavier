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

function isAuthenticatedRequest(req: VercelRequest): boolean {
  const authorization = req.headers.authorization;
  if (typeof authorization === 'string' && authorization.trim().length > 0) {
    return true;
  }

  const cookieHeader = req.headers.cookie;
  return typeof cookieHeader === 'string' && cookieHeader.includes('auth_token=');
}

function resolveProductId(req: VercelRequest): string | undefined {
  const queryId = req.query?.id;

  if (typeof queryId === 'string') {
    return queryId;
  }

  if (Array.isArray(queryId) && typeof queryId[0] === 'string') {
    return queryId[0];
  }

  const paramId = (req as VercelRequest & { params?: { id?: unknown } }).params?.id;
  if (typeof paramId === 'string') {
    return paramId;
  }

  const path = req.url?.split('?')[0] ?? '';
  const lastSegment = path.split('/').filter(Boolean).pop();
  return lastSegment;
}

export async function getProductById(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  try {
    if (isAuthenticatedRequest(req)) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    }
    const parsedParams = parseWithZod(paramsSchema, { id: resolveProductId(req) });

    if (parsedParams.success === false) {
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
