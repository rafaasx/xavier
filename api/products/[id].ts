import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getProductById } from '../../backend/src/features/products/get-product-by-id';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return getProductById(req, res);
}
