import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { isAsyncFunction } from 'util/types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  console.log("middleware activé ❤");
  
  const token = req.cookies.get("token")?.value;
  console.log("🚀 Middleware exécuté pour l'URL :", req.url);

  if (!token) {
    console.log("🔒 Aucun token trouvé → Redirection vers /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userRoles = payload.roles as string[];

    console.log("✅ Token valide, rôles :", userRoles);

    if (
      userRoles.includes("Admin") ||
      userRoles.includes("Admin Article") ||
      userRoles.includes("Admin Annonce") ||
      userRoles.includes("Utilisateur spécial")
    ) {
      console.log("✅ Accès autorisé");
      return NextResponse.next();
    }

    console.log("⛔ Accès refusé, redirection vers /");
    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    console.error("⚠️ Token invalide :", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configuration des routes protégées
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};