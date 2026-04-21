import type { VercelRequest, VercelResponse } from '@vercel/node';

import { deleteMedia } from '../../backend/src/features/media/delete-media';
import { updateMedia } from '../../backend/src/features/media/update-media';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'PUT') {
    return updateMedia(req, res);
  }

  if (req.method === 'DELETE') {
    return deleteMedia(req, res);
  }

  methodNotAllowed(req, res, ['PUT', 'DELETE', 'OPTIONS']);
  return Promise.resolve();
}

