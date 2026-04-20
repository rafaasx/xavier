import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getOpenApi } from '../backend/src/features/docs/get-openapi';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return getOpenApi(req, res);
}
