import type { VercelRequest } from '@vercel/node';

export function resolveRouteParam(req: VercelRequest, key: string): string | undefined {
  const queryValue = req.query?.[key];

  if (typeof queryValue === 'string') {
    return queryValue;
  }

  if (Array.isArray(queryValue) && typeof queryValue[0] === 'string') {
    return queryValue[0];
  }

  const paramValue = (req as VercelRequest & { params?: Record<string, unknown> }).params?.[key];
  if (typeof paramValue === 'string') {
    return paramValue;
  }

  const path = req.url?.split('?')[0] ?? '';
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) {
    return undefined;
  }

  // Supports routes like /api/products/:id and /api/tags/:id.
  return segments.at(-1);
}

