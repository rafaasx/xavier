import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { internalServerError, jsonResponse, validationError } from '../../shared/http';
import { parseWithZod, readJsonBody } from '../../shared/validation';

const payloadSchema = z.object({
  name: z.string().trim().min(3).max(120),
  shortDescription: z.string().trim().min(1).max(240),
  longDescription: z.string().trim().min(1),
  tagIds: z.array(z.string().uuid()).optional().default([]).transform((items) => Array.from(new Set(items))),
});

export async function createProduct(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const authPayload = await requireAuth(req, res);
    if (!authPayload) {
      return;
    }

    const body = await readJsonBody(req);
    const parsed = parseWithZod(payloadSchema, body);
    if (!parsed.success) {
      validationError(req, res, parsed.details);
      return;
    }

    const tagIds = parsed.data.tagIds;
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

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        shortDescription: parsed.data.shortDescription,
        longDescription: parsed.data.longDescription,
        productTags: tagIds.length
          ? {
              createMany: {
                data: tagIds.map((tagId) => ({ tagId })),
              },
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });

    jsonResponse(req, res, 201, product);
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

