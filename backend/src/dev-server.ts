import express, { type Request, type Response } from 'express';

import { login } from './features/auth/login';
import { me } from './features/auth/me';
import { getOpenApi } from './features/docs/get-openapi';
import { getSwaggerUi } from './features/docs/get-swagger-ui';
import { getHealth } from './features/health/get-health';
import { getProductById } from './features/products/get-product-by-id';
import { getProducts } from './features/products/get-products';
import { getTags } from './features/tags/get-tags';

const app = express();
const port = 3000;
const isDevMode = process.env.NODE_ENV !== 'production';

app.use(express.json());

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
app.all('/api/auth/me', asVercelHandler(me));
app.all('/api/products', asVercelHandler(getProducts));
app.all('/api/products/:id', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  await getProductById(req as any, res as any);
});
app.all('/api/tags', asVercelHandler(getTags));
app.all('/api/openapi', asVercelHandler(getOpenApi));
app.all('/api/docs', asVercelHandler(getSwaggerUi));

app.listen(port, () => {
  console.log(`Backend dev server running at http://localhost:${port}`);
});
