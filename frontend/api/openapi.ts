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

export default function handler(req: any, res: any): void {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(openApiDocument);
}
