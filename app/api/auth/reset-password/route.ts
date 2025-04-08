import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@utils/prisma";
import { generateResetToken, verifyToken } from "@utils/token";
import { sendPasswordResetEmail } from "@utils/mailer";

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    // Cas 1 : L'admin veut envoyer un email de réinitialisation
    if (email) {
      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({ where: { email }, include: { roles: true } });
      if (!user) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
      }

      const roles = user.roles.map((role) => role.name);

      // Générer un token de réinitialisation
      const resetToken = generateResetToken(user.id, user.email, roles);

      // Envoyer l'email avec le lien de réinitialisation
      await sendPasswordResetEmail(email, resetToken);

      console.log("📩 Email envoyé à :", email);
      return NextResponse.json({ message: "Email de réinitialisation envoyé." });
    }

    // Cas 2 : L'utilisateur soumet un nouveau mot de passe
    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
    }

    // Vérifier le token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour l'utilisateur en base de données
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Mot de passe mis à jour avec succès" });

  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation du mot de passe :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
