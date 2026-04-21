import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createProductMedia } from '../../../backend/src/features/media/create-product-media';
import { handlePreflight, methodNotAllowed } from '../../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'POST') {
    return createProductMedia(req, res);
  }

  methodNotAllowed(req, res, ['POST', 'OPTIONS']);
  return Promise.resolve();
}

