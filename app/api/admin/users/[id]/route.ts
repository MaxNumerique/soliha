import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Modifier un utilisateur
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    const id = Number((await params).id); // Attendre params.id

    const { name, email, role } = await request.json();

    // Vérifier si les données sont valides
    if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
      return NextResponse.json({ error: "Données invalides ou manquantes" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Si aucun rôle n'est fourni, conserver le rôle existant
    const roleName = role || existingUser.roles[0]?.name;

    if (!roleName) {
      return NextResponse.json({ error: "Un rôle est requis" }, { status: 400 });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roles: {
          set: [], // Supprime les rôles existants
          connect: { name: roleName }, // Connecte le rôle
        },
      },
      include: { roles: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 });
  }
}

// Supprimer un utilisateur
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    const id = Number((await params).id); // Attendre params.id

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 });
  }
}
