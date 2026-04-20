import { PrismaClient } from '@prisma/client';

declare global {
  var __xavierPrismaClient: PrismaClient | undefined;
}

export const prisma =
  globalThis.__xavierPrismaClient ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__xavierPrismaClient = prisma;
}
