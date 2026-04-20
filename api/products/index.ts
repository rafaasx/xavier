import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getProducts } from '../../backend/src/features/products/get-products';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return getProducts(req, res);
}
