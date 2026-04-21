const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

const prisma = globalForPrisma.__xavierPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__xavierPrisma = prisma;
}

module.exports = { prisma };
