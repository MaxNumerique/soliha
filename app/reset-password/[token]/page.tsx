"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ResetPasswordPage({ params }: { params: Promise<{ token?: string }> }) {
  const { token } = use(params); // ✅ On unwrap `params` avec `use()`
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setMessage("Votre mot de passe a été mis à jour avec succès.");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Réinitialisation du mot de passe</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Mettre à jour
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}
    </div>
  );
}
