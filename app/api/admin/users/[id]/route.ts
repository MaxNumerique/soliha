import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Modifier un utilisateur
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const id = Number(context.params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const { name, email, role } = await request.json();

    if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
      return NextResponse.json({ error: "Données invalides ou manquantes" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Si aucun rôle n'est fourni, conserver le rôle actuel
    let roleName = role || existingUser.roles[0]?.name;

    if (roleName) {
      const roleExists = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!roleExists) {
        return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
      }
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roles: {
          set: roleName ? [{ name: roleName }] : existingUser.roles.map((r) => ({ name: r.name })),
        },
      },
      include: { roles: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// Supprimer un utilisateur
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const id = Number(context.params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
