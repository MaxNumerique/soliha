// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  console.log("middleware activé ❤");
  
  const token = req.cookies.get("token")?.value;
  console.log("🚀 Middleware exécuté pour l'URL :", req.url);

  // Permet l'accès à la page d'accueil du dashboard à tout le monde
  if (req.url.includes("/dashboard") && req.url === "http://localhost:3000/dashboard") {
    console.log("✅ Accès autorisé à la page d'accueil du dashboard");
    return NextResponse.next();
  }

  if (!token) {
    console.log("🔒 Aucun token trouvé → Redirection vers /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userRoles = payload.roles as string[];

    console.log("✅ Token valide, rôles :", userRoles);

    // Définition des pages accessibles par rôle
    const url = req.nextUrl.clone();
    const path = url.pathname;

    // Accès basé sur les rôles
    if (userRoles.includes("Admin")) {
      console.log("✅ Accès autorisé : Admin");
      return NextResponse.next();
    }

    if (userRoles.includes("Utilisateur spécial")) {
      if (path.includes("/dashboard/users")) {
        console.log("⛔ Accès refusé : Utilisateur spécial ne peut pas accéder à /dashboard/users");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      console.log("✅ Accès autorisé : Utilisateur spécial");
      return NextResponse.next();
    }

    if (userRoles.includes("Admin Article")) {
      if (!path.includes("/dashboard/article")) {
        console.log("⛔ Accès refusé : Admin Article ne peut pas accéder à cette page");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      console.log("✅ Accès autorisé : Admin Article");
      return NextResponse.next();
    }

    if (userRoles.includes("Admin Annonce")) {
      if (!path.includes("/dashboard/annonce")) {
        console.log("⛔ Accès refusé : Admin Annonce ne peut pas accéder à cette page");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      console.log("✅ Accès autorisé : Admin Annonce");
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
