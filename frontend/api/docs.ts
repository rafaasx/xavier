const swaggerHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xavier API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    :root { color-scheme: light; }
    body { margin: 0; background: #ffffff; }
    #swagger-ui { max-width: 1200px; margin: 0 auto; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '/api/openapi',
      dom_id: '#swagger-ui',
      deepLinking: true,
      persistAuthorization: true
    });
  </script>
</body>
</html>`;

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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(swaggerHtml);
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

  return new Response(swaggerHtml, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
