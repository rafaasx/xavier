import type { Prisma } from '@prisma/client';
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
import { normalizeQuery, parseWithZod } from '../../shared/validation';

const querySchema = z.object({
  search: z.string().trim().optional(),
  tags: z
    .string()
    .optional()
    .transform((value) => (value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [])),
  sort: z.enum(['recent', 'name_asc', 'name_desc']).default('recent'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
});

export async function getProducts(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  try {
    const parsedQuery = parseWithZod(querySchema, normalizeQuery(req.query));

    if (!parsedQuery.success) {
      validationError(req, res, parsedQuery.details);
      return;
    }

    const { search, tags, sort, page, pageSize } = parsedQuery.data;

    const where: Prisma.ProductWhereInput = {
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(tags.length > 0
        ? {
            productTags: {
              some: {
                tagId: {
                  in: tags,
                },
              },
            },
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'name_asc'
        ? { name: 'asc' }
        : sort === 'name_desc'
          ? { name: 'desc' }
          : { createdAt: 'desc' };

    const [items, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          shortDescription: true,
          medias: {
            where: {
              type: 'IMAGE',
            },
            orderBy: {
              order: 'asc',
            },
            take: 1,
            select: {
              url: true,
            },
          },
          productTags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    jsonResponse(req, res, 200, {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
        mainImage: item.medias[0]?.url ?? null,
        tags: item.productTags.map((productTag) => productTag.tag),
      })),
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}
