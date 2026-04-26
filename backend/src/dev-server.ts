import express, { type Request, type Response } from 'express';

import { login } from './features/auth/login';
import { logout } from './features/auth/logout';
import { me } from './features/auth/me';
import { getOpenApi } from './features/docs/get-openapi';
import { getSwaggerUi } from './features/docs/get-swagger-ui';
import { getHealth } from './features/health/get-health';
import { createProduct } from './features/products/create-product';
import { deleteProduct } from './features/products/delete-product';
import { getProductById } from './features/products/get-product-by-id';
import { getProducts } from './features/products/get-products';
import { manageProductCommand } from './features/products/manage-product-command';
import { updateProduct } from './features/products/update-product';
import { getTags } from './features/tags/get-tags';
import { applyCorsHeaders, methodNotAllowed } from './shared/http';
import { readJsonBody } from './shared/validation';

const app = express();
const port = 3000;
const isDevMode = process.env.NODE_ENV !== 'production';

app.use(express.json());
app.use('/api', (req: Request, res: Response, next) => {
  applyCorsHeaders(req as any, res as any);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

app.get('/', (_req: Request, res: Response) => {
  if (isDevMode) {
    res.redirect('/api/docs');
    return;
  }

  res.status(404).end();
});

const asVercelHandler = (handler: (req: any, res: any) => Promise<void>) => {
  return async (req: Request, res: Response) => {
    await handler(req as any, res as any);
  };
};

app.all('/api/health', asVercelHandler(getHealth));
app.all('/api/auth/login', asVercelHandler(login));
app.all('/api/auth/logout', asVercelHandler(logout));
app.all('/api/auth/me', asVercelHandler(me));
app.all('/api/products', async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    await getProducts(req as any, res as any);
    return;
  }

  if (req.method === 'POST') {
    const body = await readJsonBody(req as any);
    (req as any).body = body;
    if (typeof body === 'object' && body !== null && 'action' in body) {
      await manageProductCommand(req as any, res as any);
      return;
    }

    await createProduct(req as any, res as any);
    return;
  }

  methodNotAllowed(req as any, res as any, ['GET', 'POST', 'OPTIONS']);
});
app.all('/api/products/:id', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  if (req.method === 'GET') {
    await getProductById(req as any, res as any);
    return;
  }

  if (req.method === 'PUT') {
    await updateProduct(req as any, res as any);
    return;
  }

  if (req.method === 'DELETE') {
    await deleteProduct(req as any, res as any);
    return;
  }

  methodNotAllowed(req as any, res as any, ['GET', 'PUT', 'DELETE', 'OPTIONS']);
});
app.all('/api/tags', async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    await getTags(req as any, res as any);
    return;
  }

  methodNotAllowed(req as any, res as any, ['GET', 'OPTIONS']);
});
app.all('/api/openapi', asVercelHandler(getOpenApi));
app.all('/api/docs', asVercelHandler(getSwaggerUi));

app.listen(port, () => {
  console.log(`Backend dev server running at http://localhost:${port}`);
});
