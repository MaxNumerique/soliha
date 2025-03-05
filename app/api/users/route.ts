import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../utils/prisma';


export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Cet utilisateur existe déjà' }, { status: 400 });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si le rôle fourni existe
    const existingRole = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Le rôle spécifié est invalide' }, { status: 400 });
    }

    // Définir `isAdmin` sur `true` si le rôle est "Admin", sinon `false`
    const isAdmin = role === 'Admin' ? true : false;

    // Créer un nouvel utilisateur avec le rôle et le statut d'admin
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin, // Attribuer isAdmin en fonction du rôle
        roles: {
          connect: { name: role }, // Associer le rôle à l'utilisateur
        },
      },
      include: {
        roles: true, // Inclure les rôles dans la réponse
      },
    });

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roles: newUser.roles.map(role => role.name), // Retourne uniquement les noms des rôles
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: true, // Inclure les rôles dans la réponse
      },
    });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Cet utilisateur n\'existe pas' }, { status: 404 });
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'L\'utilisateur a été supprimé avec succès' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
