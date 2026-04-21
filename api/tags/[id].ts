import type { VercelRequest, VercelResponse } from '@vercel/node';

import { deleteTag } from '../../backend/src/features/tags/delete-tag';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'DELETE') {
    return deleteTag(req, res);
  }

  methodNotAllowed(req, res, ['DELETE', 'OPTIONS']);
  return Promise.resolve();
}

