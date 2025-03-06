import { NextResponse } from 'next/server';
import { authenticateUser } from '../../utils/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const token = await authenticateUser(email, password);

    // Création de la réponse avec le cookie sécurisé
    const response = NextResponse.json({ message: 'Connexion réussie' });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2h
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}