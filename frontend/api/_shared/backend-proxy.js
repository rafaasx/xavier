const FORWARDED_HEADERS = ['authorization', 'content-type', 'x-request-id', 'x-correlation-id', 'cookie'];

function getBackendApiBaseUrl() {
  const value = process.env.BACKEND_API_BASE_URL?.trim();
  if (!value) {
    throw new Error('BACKEND_API_BASE_URL is not configured');
  }

  return value.replace(/\/+$/, '');
}

function ensureNoSelfProxyLoop(req, baseUrl) {
  const forwardedHost = req.headers?.['x-forwarded-host'];
  const rawHost = typeof forwardedHost === 'string' ? forwardedHost : req.headers?.host;
  const requestHost = String(rawHost ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  if (!requestHost) {
    return;
  }

  const backendUrl = new URL(baseUrl);
  const backendHost = backendUrl.host.toLowerCase();
  const backendPath = backendUrl.pathname.replace(/\/+$/, '');

  if (backendHost === requestHost && backendPath === '/api') {
    throw new Error('BACKEND_API_BASE_URL points to current frontend host');
  }
}

function copyHeaders(req) {
  const headers = {};

  for (const name of FORWARDED_HEADERS) {
    const value = req.headers?.[name];
    if (typeof value === 'string' && value.trim()) {
      headers[name] = value;
    }
  }

  return headers;
}

function applyResponseHeaders(source, target) {
  for (const [name, value] of source.entries()) {
    if (name.toLowerCase() === 'transfer-encoding') {
      continue;
    }

    target.setHeader(name, value);
  }
}

async function proxyToBackend(req, res, backendPath) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const baseUrl = getBackendApiBaseUrl();
  ensureNoSelfProxyLoop(req, baseUrl);
  const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `${baseUrl}/${backendPath}${query}`;

  let body;
  if (req.method && !['GET', 'HEAD'].includes(req.method.toUpperCase())) {
    body = typeof req.body === 'string' ? req.body : req.body ? JSON.stringify(req.body) : undefined;
  }

  const backendResponse = await fetch(targetUrl, {
    method: req.method || 'GET',
    headers: copyHeaders(req),
    body,
  });

  applyResponseHeaders(backendResponse.headers, res);
  res.statusCode = backendResponse.status;

  const responseText = await backendResponse.text();
  res.end(responseText);
}

module.exports = {
  proxyToBackend,
};
