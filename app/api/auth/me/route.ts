import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@utils/token";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("🔒 Aucun token trouvé dans /api/auth/me");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 403 });
    }

    console.log("✅ Token valide, rôles :", decoded.roles);

    return NextResponse.json({ roles: decoded.roles });
  } catch (error) {
    console.error("❌ Erreur serveur dans /api/auth/me :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
