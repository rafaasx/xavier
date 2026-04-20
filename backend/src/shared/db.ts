import { PrismaClient } from '@prisma/client';

import { ensureEnvLoaded } from './env';

declare global {
  var __xavierPrismaClient: PrismaClient | undefined;
}

ensureEnvLoaded();

export const prisma =
  globalThis.__xavierPrismaClient ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__xavierPrismaClient = prisma;
}
