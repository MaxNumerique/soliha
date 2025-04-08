// app/reset-password/[token]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Décoder le token côté client
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setEmail(decoded.email);
      setRole(Array.isArray(decoded.roles) ? decoded.roles[0] : decoded.roles);
    } catch (err) {
      console.error("Erreur de décodage du token", err);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setMessage("Mot de passe mis à jour avec succès !");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h1>

      <div className="mb-4 w-full max-w-md">
        <p><strong>Email :</strong> {email}</p>
        <p><strong>Rôle :</strong> {role}</p>
      </div>

      <form onSubmit={handleSubmit} className="form-control w-full max-w-md">
        <label className="label">
          <span className="label-text">Mot de passe</span>
        </label>
        <input
          type="password"
          placeholder="Mot de passe"
          className="input input-bordered"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="label">
          <span className="label-text">Confirmer le mot de passe</span>
        </label>
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="input input-bordered"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn btn-primary"
        >
          Mettre à jour
        </button>
        {error && <p className="text-error">{error}</p>}
        {message && <p className="text-success">{message}</p>}
      </form>
    </div>
  );
}
