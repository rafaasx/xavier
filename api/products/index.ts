import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createProduct } from '../../backend/src/features/products/create-product';
import { getProducts } from '../../backend/src/features/products/get-products';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'GET') {
    return getProducts(req, res);
  }

  if (req.method === 'POST') {
    return createProduct(req, res);
  }

  methodNotAllowed(req, res, ['GET', 'POST', 'OPTIONS']);
  return Promise.resolve();
}
