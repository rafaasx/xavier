import type { VercelRequest, VercelResponse } from '@vercel/node';

import { logout } from '../../backend/src/features/auth/logout';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return logout(req, res);
}

