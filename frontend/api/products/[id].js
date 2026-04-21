const { proxyToBackend } = require('../_shared/backend-proxy');
const { getFallbackProductById } = require('../_shared/store-fallback');

function resolveId(req) {
  if (typeof req.query?.id === 'string') {
    return req.query.id;
  }

  const path = (req.url || '').split('?')[0];
  return path.split('/').filter(Boolean).pop();
}

module.exports = async function handler(req, res) {
  const id = resolveId(req);
  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Validation failed', details: { fieldErrors: { id: ['Required'] } } }));
    return;
  }

  if (!process.env.BACKEND_API_BASE_URL?.trim()) {
    const product = getFallbackProductById(id);
    if (!product) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Product not found' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('x-xavier-data-source', 'fallback');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(product));
    return;
  }

  try {
    await proxyToBackend(req, res, `products/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      (error.message === 'BACKEND_API_BASE_URL is not configured' ||
        error.message === 'BACKEND_API_BASE_URL points to current frontend host')
    ) {
      const product = getFallbackProductById(id);
      if (!product) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('x-xavier-data-source', 'fallback');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(product));
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};
