import type { VercelRequest, VercelResponse } from '@vercel/node';

import { createProduct } from '../../backend/src/features/products/create-product';
import { getProducts } from '../../backend/src/features/products/get-products';
import { manageProductCommand } from '../../backend/src/features/products/manage-product-command';
import { handlePreflight, methodNotAllowed } from '../../backend/src/shared/http';
import { readJsonBody } from '../../backend/src/shared/validation';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return Promise.resolve();
  }

  if (req.method === 'GET') {
    return getProducts(req, res);
  }

  if (req.method === 'POST') {
    return readJsonBody(req).then((body) => {
      req.body = body;

      if (typeof body === 'object' && body !== null && 'action' in body) {
        return manageProductCommand(req, res);
      }

      return createProduct(req, res);
    });
  }

  methodNotAllowed(req, res, ['GET', 'POST', 'OPTIONS']);
  return Promise.resolve();
}
