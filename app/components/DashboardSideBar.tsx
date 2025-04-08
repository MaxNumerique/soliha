"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDashboard, MdArticle, MdCampaign, MdSettings, MdPeople, MdLogout } from "react-icons/md";

export default function DashboardSidebar() {
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserRoles(data.roles || []);
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

  const hasAccess = (roles: string[]) => roles.some((role) => userRoles.includes(role));

  const menuItems = [
    { name: "Tableau de bord", path: "/dashboard", roles: [], icon: <MdDashboard size={24} /> },
    { name: "Articles", path: "/dashboard/articles", roles: ["Admin", "Admin Article", "Utilisateur spécial"], icon: <MdArticle size={24} /> },
    { name: "Annonces", path: "/dashboard/annonce", roles: ["Admin", "Admin Annonce", "Utilisateur spécial"], icon: <MdCampaign size={24} /> },
    { name: "Gestion du site", path: "/dashboard/site", roles: ["Admin", "Utilisateur spécial"], icon: <MdSettings size={24} /> },
    { name: "Utilisateurs", path: "/dashboard/users", roles: ["Admin"], icon: <MdPeople size={24} /> },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-info text-4xl"></span>
      </div>
    );

  return (
    <nav className="fixed top-0 left-0 h-screen w-20 bg-gray-800 text-white p-4 pt-24 flex flex-col gap-4 items-center shadow-lg z-100">
      {menuItems.map((item) => {
        const isAccessible = item.roles.length === 0 || hasAccess(item.roles);

        return (
          <div key={item.path} className="tooltip tooltip-right" data-tip={item.name}>
            <button
              onClick={() => isAccessible && router.push(item.path)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                isAccessible ? "z10 bg-gray-700 hover:bg-gray-600" : "bg-gray-900 opacity-50 cursor-not-allowed"
              }`}
            >
              {item.icon}
            </button>
          </div>
        );
      })}

      {/* Bouton de déconnexion sans tooltip */}
      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
        }}
        className="mt-auto w-10 h-10 flex flex-col items-center text-center gap-1 p-3 rounded-lg bg-red-700 hover:bg-red-600"
      >
        <MdLogout size={24} />
      </button>
    </nav>
  );
}
