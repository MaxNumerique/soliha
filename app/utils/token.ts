// utils/token.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

export interface JwtPayload {
  userId: number;
  email: string;
  roles: string[];
}

export function generateResetToken(userId: number, email: string, roles: string[]) {
  const token = jwt.sign({ userId, email, roles }, JWT_SECRET, { expiresIn: "24h" });
  console.log("🔑 Token généré :", token); // DEBUG
  return token;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as JwtPayload;
  } catch (error) {
    console.error("⚠️ Erreur de vérification du token :", error);
    return null;
  }
}