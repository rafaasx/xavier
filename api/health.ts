import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getHealth } from '../backend/src/features/health/get-health';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return getHealth(req, res);
}
