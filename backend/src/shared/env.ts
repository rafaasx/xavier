import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required').optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must have at least 32 characters'),
  JWT_ISSUER: z.string().min(1).default('xavier-api'),
  JWT_AUDIENCE: z.string().min(1).default('xavier-app'),
  JWT_EXPIRATION_MINUTES: z.coerce.number().int().positive().default(480),
  ADMIN_EMAIL: z.string().email().default('admin@rafaelxavier.com'),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ALLOWED_ORIGINS: z.string().optional(),
});

type ParsedEnv = z.infer<typeof envSchema>;

let cachedEnv: ParsedEnv | null = null;

export function getEnv(): ParsedEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse(process.env);
  return cachedEnv;
}
