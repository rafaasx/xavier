import type { VercelRequest, VercelResponse } from '@vercel/node';

import { appendSetCookieHeader, handlePreflight, jsonResponse, methodNotAllowed } from '../../shared/http';

export async function logout(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (handlePreflight(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST', 'OPTIONS']);
    return;
  }

  const isHttps = req.headers['x-forwarded-proto'] === 'https';
  const cookieSecuritySuffix = isHttps ? '; Secure' : '';

  appendSetCookieHeader(
    res,
    `xavier_access_token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly${cookieSecuritySuffix}`,
  );
  appendSetCookieHeader(res, `xavier_swagger_token=; Path=/; Max-Age=0; SameSite=Lax${cookieSecuritySuffix}`);

  jsonResponse(req, res, 200, { success: true });
}

