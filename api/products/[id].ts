import type { VercelRequest, VercelResponse } from '@vercel/node';

import { deleteProduct } from '../../backend/src/features/products/delete-product';
import { getProductById } from '../../backend/src/features/products/get-product-by-id';
import { updateProduct } from '../../backend/src/features/products/update-product';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'GET') {
    return getProductById(req, res);
  }

  if (req.method === 'PUT') {
    return updateProduct(req, res);
  }

  if (req.method === 'DELETE') {
    return deleteProduct(req, res);
  }

  methodNotAllowed(req, res, ['GET', 'PUT', 'DELETE', 'OPTIONS']);
  return Promise.resolve();
}
