"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "../components/DashboardSideBar";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold">Bienvenue sur le Dashboard</h1>
      </div>
    </div>
  );
}
