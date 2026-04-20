import type { VercelRequest, VercelResponse } from '@vercel/node';

import { login } from '../../backend/src/features/auth/login';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return login(req, res);
}
