import type { VercelRequest } from '@vercel/node';
import { z } from 'zod';

export async function readJsonBody(req: VercelRequest): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      return req.body.length > 0 ? JSON.parse(req.body) : {};
    }

    return req.body;
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const textBody = Buffer.concat(chunks).toString('utf8');
  return textBody.length > 0 ? JSON.parse(textBody) : {};
}

export function normalizeQuery(query: VercelRequest['query']): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }

  return normalized;
}

export function parseWithZod<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  value: unknown,
):
  | {
      success: true;
      data: z.infer<TSchema>;
    }
  | {
      success: false;
      details: ReturnType<z.ZodError['flatten']>;
    } {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    return {
      success: false,
      details: parsed.error.flatten(),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}
