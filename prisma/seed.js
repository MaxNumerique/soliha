import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer les rôles
  await prisma.role.createMany({
    data: [
      { name: 'Admin' },
      { name: 'Admin Article' },
      { name: 'Admin Annonce' },
      { name: 'Utilisateur spécial' },
    ],
    skipDuplicates: true, // Évite d'ajouter des doublons
  });

  console.log('Roles ajoutés à la base de données.');

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
