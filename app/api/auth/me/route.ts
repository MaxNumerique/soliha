import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("🔒 Aucun token trouvé dans /api/auth/me");
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("✅ Token valide, rôles :", decoded.roles);

    return NextResponse.json({ roles: decoded.roles });
  } catch (error) {
    console.error("⚠️ Token invalide :", error);
    return NextResponse.json({ error: "Token invalide" }, { status: 403 });
  }
}
