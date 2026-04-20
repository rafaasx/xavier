import type { VercelRequest, VercelResponse } from '@vercel/node';

import { applyCorsHeaders, handlePreflight, methodNotAllowed } from '../../shared/http';

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
    function readCookie(name) {
      const match = document.cookie
        .split('; ')
        .find((item) => item.startsWith(name + '='));

      if (!match) {
        return null;
      }

      const encoded = match.substring(name.length + 1);
      return decodeURIComponent(encoded);
    }

    window.ui = SwaggerUIBundle({
      url: '/api/openapi',
      dom_id: '#swagger-ui',
      deepLinking: true,
      persistAuthorization: true,
      requestInterceptor: (request) => {
        const isLoginRequest = request.url.endsWith('/api/auth/login');

        if (!isLoginRequest) {
          const token = readCookie('xavier_swagger_token');

          if (token && (!request.headers || !request.headers.Authorization)) {
            request.headers = request.headers || {};
            request.headers.Authorization = 'Bearer ' + token;
          }
        }

        return request;
      }
    });
  </script>
</body>
</html>`;

export async function getSwaggerUi(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    methodNotAllowed(req, res, ['GET', 'OPTIONS']);
    return;
  }

  applyCorsHeaders(req, res);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(swaggerHtml);
}
