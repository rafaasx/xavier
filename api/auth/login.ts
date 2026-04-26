import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const module = await import('../../backend/src/features/auth/login.js');
    await module.login(req, res);
  } catch (error) {
    console.error('[api/auth/login] Bootstrap failure', {
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ error: 'Internal server error', source: 'api-auth-login-bootstrap' });
  }
}
