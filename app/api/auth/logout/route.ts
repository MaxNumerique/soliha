import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Supprimer le cookie 'token' lors de la déconnexion
  const response = NextResponse.json({ message: 'Déconnexion réussie' });

  response.cookies.set('token', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
