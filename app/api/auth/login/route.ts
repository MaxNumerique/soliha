import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@utils/prisma';
import { setAuthCookie } from "@utils/cookies";
import { generateToken } from "@utils/auth";


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
    const token = await generateToken(user);


    // Création de la réponse et enregistrement du cookie
    const response = NextResponse.json({ message: 'Connexion réussie', token });

    // Ajout du cookie
    setAuthCookie(response, token);
    
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
