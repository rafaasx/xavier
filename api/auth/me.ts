import type { VercelRequest, VercelResponse } from '@vercel/node';

import { me } from '../../backend/src/features/auth/me';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return me(req, res);
}
