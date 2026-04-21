import type { VercelRequest, VercelResponse } from '@vercel/node';

import { reorderProductMedias } from '../../../../backend/src/features/media/reorder-product-medias';
import { handlePreflight, methodNotAllowed } from '../../../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'PUT') {
    return reorderProductMedias(req, res);
  }

  methodNotAllowed(req, res, ['PUT', 'OPTIONS']);
  return Promise.resolve();
}

