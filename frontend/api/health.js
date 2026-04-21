const { proxyToBackend } = require('./_shared/backend-proxy');

module.exports = async function handler(req, res) {
  try {
    await proxyToBackend(req, res, 'health');
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
