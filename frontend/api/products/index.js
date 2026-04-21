const { proxyToBackend } = require('../_shared/backend-proxy');
const { getFallbackProducts } = require('../_shared/store-fallback');

module.exports = async function handler(req, res) {
  if (!process.env.BACKEND_API_BASE_URL?.trim()) {
    res.statusCode = 200;
    res.setHeader('x-xavier-data-source', 'fallback');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(getFallbackProducts(req.query ?? {})));
    return;
  }

  try {
    await proxyToBackend(req, res, 'products');
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      (error.message === 'BACKEND_API_BASE_URL is not configured' ||
        error.message === 'BACKEND_API_BASE_URL points to current frontend host')
    ) {
      res.statusCode = 200;
      res.setHeader('x-xavier-data-source', 'fallback');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(getFallbackProducts(req.query ?? {})));
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};
