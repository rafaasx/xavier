import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getTags } from '../../backend/src/features/tags/get-tags';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return getTags(req, res);
}
