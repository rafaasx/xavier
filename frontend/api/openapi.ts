const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Xavier API',
    version: '1.0.0',
    description: 'API de backend do projeto Xavier.',
  },
  servers: [
    { url: '/', description: 'Mesmo host (Vercel)' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
  tags: [{ name: 'Health' }],
};

export default function handler(req: any, res?: any): any {
  const method = req?.method ?? 'GET';

  if (res) {
    if (method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS');
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(openApiDocument);
    return;
  }

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        allow: 'GET, OPTIONS',
        'content-type': 'application/json; charset=utf-8',
      },
    });
  }

  return new Response(JSON.stringify(openApiDocument), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
