import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createAffiliateLink } from '../../../backend/src/features/affiliate-links/create-affiliate-link';
import { handlePreflight, methodNotAllowed } from '../../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'POST') {
    return createAffiliateLink(req, res);
  }

  methodNotAllowed(req, res, ['POST', 'OPTIONS']);
  return Promise.resolve();
}

