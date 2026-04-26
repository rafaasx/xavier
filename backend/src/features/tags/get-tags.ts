import type { VercelRequest, VercelResponse } from '@vercel/node';

import { prisma } from '../../shared/db';
import { handlePreflight, internalServerError, jsonResponse, methodNotAllowed } from '../../shared/http';

function isAuthenticatedRequest(req: VercelRequest): boolean {
  const authorization = req.headers.authorization;
  if (typeof authorization === 'string' && authorization.trim().length > 0) {
    return true;
  }

  const cookieHeader = req.headers.cookie;
  return typeof cookieHeader === 'string' && cookieHeader.includes('auth_token=');
}

export async function getTags(req: VercelRequest, res: VercelResponse): Promise<void> {
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
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    }
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
