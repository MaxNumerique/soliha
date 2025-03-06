"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await fetch("/api/auth/me"); // Endpoint pour récupérer les rôles
        if (res.ok) {
          const data = await res.json();
          setUserRoles(data.roles || []);
          console.log("Rôles de l'utilisateur:", data.roles);
        } else {
          console.error("Échec de récupération des rôles");
        }
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, []);

  // Vérifie si l'utilisateur a accès à un bouton
  const hasAccess = (roles: string[]) => roles.some((role) => userRoles.includes(role));

  // Liste des boutons de navigation
  const menuItems = [
    { name: "Tableau de bord", path: "/dashboard", roles: [], icon: "🏠" },
    { name: "Articles", path: "/dashboard/article", roles: ["Admin", "Admin Article", "Utilisateur spécial"], icon: "📰" },
    { name: "Annonces", path: "/dashboard/annonce", roles: ["Admin", "Admin Annonce", "Utilisateur spécial"], icon: "📢" },
    { name: "Gestion du site", path: "/dashboard/site", roles: ["Admin", "Utilisateur spécial"], icon: "⚙️" },
    { name: "Utilisateurs", path: "/dashboard/users", roles: ["Admin"], icon: "👥" },
  ];

  if (loading) return 
  <div className="flex justify-center items-center h-screen">
    <span className="loading loading-spinner text-info text-4xl"></span>
  </div>;

  return (
    <div className="flex h-screen">
      {/* Menu vertical */}
      <nav className="w-64 bg-gray-800 text-white p-4 pt-8 flex flex-col gap-4">
        {menuItems.map((item) => {
          const isAccessible = item.roles.length === 0 || hasAccess(item.roles);

          return (
            <div key={item.path} className="relative group">
            <button
              onClick={() => isAccessible && router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition 
                ${isAccessible ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-900 opacity-50 cursor-not-allowed"}`}
            >
              <span>{item.icon}</span> {item.name}
            </button>
          
            {/* Tooltip qui s'affiche uniquement au hover */}
            <div
              className="tooltip absolute left-full ml-3"
              data-tip={isAccessible ? `Accéder à ${item.name}` : "Accès interdit"}
            />
          </div>   
          );
        })}
        {/* Bouton de déconnexion */}
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition bg-red-700 hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </nav>

      {/* Contenu principal */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Bienvenue sur le Dashboard</h1>
      </div>
    </div>
  );
}
