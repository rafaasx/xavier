import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getSwaggerUi } from '../backend/src/features/docs/get-swagger-ui';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return getSwaggerUi(req, res);
}
