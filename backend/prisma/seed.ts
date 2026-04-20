import bcrypt from 'bcryptjs';

import { prisma } from '../src/shared/db';
import { getEnv } from '../src/shared/env';

async function runSeed() {
  const env = getEnv();

  if (!env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is required to run seed.');
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 11);

  await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: env.ADMIN_EMAIL,
      passwordHash,
    },
  });
}

runSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
