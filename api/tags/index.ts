import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getTags } from '../../backend/src/features/tags/get-tags';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'GET') {
    return getTags(req, res);
  }

  methodNotAllowed(req, res, ['GET', 'OPTIONS']);
  return Promise.resolve();
}
