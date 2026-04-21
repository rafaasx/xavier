const { proxyToBackend } = require('./_shared/backend-proxy');

module.exports = async function handler(req, res) {
  if (!process.env.BACKEND_API_BASE_URL?.trim()) {
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
      deepLinking: true
    });
  </script>
</body>
</html>`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(swaggerHtml);
    return;
  }

  try {
    await proxyToBackend(req, res, 'docs');
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
