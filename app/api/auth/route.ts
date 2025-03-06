import { NextResponse } from 'next/server';
import { authenticateUser } from '@utils/auth';
import { setAuthCookie } from '@utils/cookies';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const token = await authenticateUser(email, password);

    // Création de la réponse avec le cookie sécurisé
    const response = NextResponse.json({ message: 'Connexion réussie' });

    // Création du cookie de session
    setAuthCookie(response, token);

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}