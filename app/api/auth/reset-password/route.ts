import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    console.log("🔍 Token reçu dans l'API :", token); // DEBUG

    if (!token) {
      return NextResponse.json({ error: "Aucun token fourni" }, { status: 400 });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    console.log("✅ Token décodé :", decoded);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Mot de passe mis à jour avec succès" });

  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
