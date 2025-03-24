import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@utils/prisma";
import { verifyToken } from "@utils/token";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json(); // ✅ Récupérer le token et le password

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
    console.error("❌ Erreur lors de la mise à jour du mot de passe :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
