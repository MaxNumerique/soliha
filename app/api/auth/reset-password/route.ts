import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '@/utils/mailer';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Générer un token de réinitialisation
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Lien de réinitialisation
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Envoyer l'email
    await sendResetEmail(email, resetLink);

    return NextResponse.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email de réinitialisation" }, { status: 500 });
  }
}
