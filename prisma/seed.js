import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Créer les rôles
  await prisma.role.createMany({
    data: [
      { name: 'Admin' },
      { name: 'Admin Article' },
      { name: 'Admin Annonce' },
      { name: 'Utilisateur Spécial' },
    ],
    skipDuplicates: true, // Évite d'ajouter des doublons
  });

  console.log('Roles ajoutés à la base de données.');

  // Créer un utilisateur admin par défaut
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  const defaultUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin',
      password: hashedPassword,
      isAdmin: true,
      roles: {
        connect: [
          { name: 'Admin' },
        ]
      }
    }
  });

  console.log('Utilisateur admin créé:', defaultUser.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
