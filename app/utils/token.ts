import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

export interface JwtPayload {
  userId: number;
  roles: string[];
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null; // Vérification de type
    return decoded as JwtPayload;
  } catch (error) {
    console.error("⚠️ Erreur de vérification du token :", error);
    return null;
  }
}
