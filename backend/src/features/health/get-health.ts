import type { VercelRequest, VercelResponse } from '@vercel/node';

import { handlePreflight, jsonResponse, methodNotAllowed } from '../../shared/http';

export async function getHealth(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  jsonResponse(req, res, 200, {
    status: 'healthy',
  });
}
