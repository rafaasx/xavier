const { proxyToBackend } = require('./_shared/backend-proxy');

module.exports = async function handler(req, res) {
  if (!process.env.BACKEND_API_BASE_URL?.trim()) {
    const openApiDocument = {
      openapi: '3.0.3',
      info: {
        title: 'Xavier API',
        version: '1.0.0',
        description: 'API de backend do projeto Xavier.',
      },
      servers: [{ url: '/', description: 'Mesmo host (Vercel)' }],
      paths: {
        '/api/health': {
          get: {
            tags: ['Health'],
            summary: 'Health check',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
      tags: [{ name: 'Health' }],
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(openApiDocument));
    return;
  }

  try {
    await proxyToBackend(req, res, 'openapi');
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
