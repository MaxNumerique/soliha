import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@exemple.com' }
  });

  if (existing) {
    console.log('L’admin existe déjà.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin', 10); // 10 = salt rounds

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin',
      password: hashedPassword,
      isAdmin: true,
      roles: {
        connect: { name: 'Admin' }
      }
    }
  });

  console.log('✅ Admin créé avec mot de passe hashé');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
