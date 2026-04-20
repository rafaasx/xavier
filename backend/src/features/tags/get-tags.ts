import type { VercelRequest, VercelResponse } from '@vercel/node';

import { prisma } from '../../shared/db';
import { handlePreflight, internalServerError, jsonResponse, methodNotAllowed } from '../../shared/http';

export async function getTags(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    jsonResponse(req, res, 200, tags);
  } catch (error) {
    console.error(error);
    internalServerError(req, res);
  }
}
