import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getProductById } from '../../backend/src/features/products/get-product-by-id';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'GET') {
    return getProductById(req, res);
  }

  if (req.method === 'PUT') {
    return import('../../backend/src/features/products/update-product.js').then((module) =>
      module.updateProduct(req, res),
    );
  }

  if (req.method === 'DELETE') {
    return import('../../backend/src/features/products/delete-product.js').then((module) =>
      module.deleteProduct(req, res),
    );
  }

  methodNotAllowed(req, res, ['GET', 'PUT', 'DELETE', 'OPTIONS']);
  return Promise.resolve();
}
