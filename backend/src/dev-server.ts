import express, { type Request, type Response } from 'express';

import { createAffiliateLink } from './features/affiliate-links/create-affiliate-link';
import { deleteAffiliateLink } from './features/affiliate-links/delete-affiliate-link';
import { updateAffiliateLink } from './features/affiliate-links/update-affiliate-link';
import { login } from './features/auth/login';
import { logout } from './features/auth/logout';
import { me } from './features/auth/me';
import { getOpenApi } from './features/docs/get-openapi';
import { getSwaggerUi } from './features/docs/get-swagger-ui';
import { getHealth } from './features/health/get-health';
import { createProductMedia } from './features/media/create-product-media';
import { deleteMedia } from './features/media/delete-media';
import { reorderProductMedias } from './features/media/reorder-product-medias';
import { updateMedia } from './features/media/update-media';
import { createProduct } from './features/products/create-product';
import { deleteProduct } from './features/products/delete-product';
import { getProductById } from './features/products/get-product-by-id';
import { getProducts } from './features/products/get-products';
import { updateProduct } from './features/products/update-product';
import { createTag } from './features/tags/create-tag';
import { deleteTag } from './features/tags/delete-tag';
import { getTags } from './features/tags/get-tags';
import { applyCorsHeaders, methodNotAllowed } from './shared/http';

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
app.all('/api/products/:id/medias', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  await createProductMedia(req as any, res as any);
});
app.all('/api/products/:id/medias/reorder', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  await reorderProductMedias(req as any, res as any);
});
app.all('/api/medias/:id', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  if (req.method === 'PUT') {
    await updateMedia(req as any, res as any);
    return;
  }

  if (req.method === 'DELETE') {
    await deleteMedia(req as any, res as any);
    return;
  }

  methodNotAllowed(req as any, res as any, ['PUT', 'DELETE', 'OPTIONS']);
});
app.all('/api/products/:id/affiliate-links', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  await createAffiliateLink(req as any, res as any);
});
app.all('/api/affiliate-links/:id', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  if (req.method === 'PUT') {
    await updateAffiliateLink(req as any, res as any);
    return;
  }

  if (req.method === 'DELETE') {
    await deleteAffiliateLink(req as any, res as any);
    return;
  }

  methodNotAllowed(req as any, res as any, ['PUT', 'DELETE', 'OPTIONS']);
});
app.all('/api/tags', async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    await getTags(req as any, res as any);
    return;
  }

  if (req.method === 'POST') {
    await createTag(req as any, res as any);
    return;
  }

  methodNotAllowed(req as any, res as any, ['GET', 'POST', 'OPTIONS']);
});
app.all('/api/tags/:id', async (req: Request, res: Response) => {
  (req as any).query = { ...(req as any).query, id: req.params.id };
  await deleteTag(req as any, res as any);
});
app.all('/api/openapi', asVercelHandler(getOpenApi));
app.all('/api/docs', asVercelHandler(getSwaggerUi));

app.listen(port, () => {
  console.log(`Backend dev server running at http://localhost:${port}`);
});
