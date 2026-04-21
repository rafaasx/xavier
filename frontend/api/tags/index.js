const { proxyToBackend } = require('../_shared/backend-proxy');
const { getFallbackTags } = require('../_shared/store-fallback');

module.exports = async function handler(req, res) {
  if (!process.env.BACKEND_API_BASE_URL?.trim()) {
    res.statusCode = 200;
    res.setHeader('x-xavier-data-source', 'fallback');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(getFallbackTags()));
    return;
  }

  try {
    await proxyToBackend(req, res, 'tags');
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'BACKEND_API_BASE_URL is not configured') {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Backend API is not configured' }));
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
};
