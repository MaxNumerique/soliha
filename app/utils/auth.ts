import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

export async function generateToken(user: any) {
  console.log("🔍 Génération du token pour l'utilisateur :", user);

  if (!user.roles) {
    console.error("⚠️ Erreur: user.roles est undefined !");
    throw new Error("Problème avec les rôles de l'utilisateur");
  }

  return jwt.sign(
    { userId: user.id, roles: user.roles.map((role) => role.name) },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}


export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!user) throw new Error("Utilisateur non trouvé");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error("Mot de passe incorrect");

  return generateToken(user);
}
