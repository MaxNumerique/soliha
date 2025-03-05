import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../utils/prisma';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Chercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 400 });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, roles: user.roles.map(role => role.name) },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    // Création de la réponse et enregistrement du cookie
    const response = NextResponse.json({ message: 'Connexion réussie', token });

    // Ajout du cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2h
      path: '/',
    });

    return response; // On retourne cette réponse, pas une nouvelle
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
