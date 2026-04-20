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

module.exports = function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(openApiDocument));
};
