import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { requireAuth } from '../../shared/auth';
import { prisma } from '../../shared/db';
import { conflict, internalServerError, validationError } from '../../shared/http';
import { parseWithZod, readJsonBody } from '../../shared/validation';

const payloadSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export async function createTag(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const authPayload = await requireAuth(req, res);
    if (!authPayload) {
      return;
    }

    const body = await readJsonBody(req);
    const parsedBody = parseWithZod(payloadSchema, body);
    if (!parsedBody.success) {
      validationError(req, res, parsedBody.details);
      return;
    }

    const normalizedName = parsedBody.data.name.toLocaleUpperCase('pt-BR');
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });

    if (existingTag) {
      conflict(req, res, 'Já existe uma tag com esse nome.');
      return;
    }

    const tag = await prisma.tag.create({
      data: {
        name: normalizedName,
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}

