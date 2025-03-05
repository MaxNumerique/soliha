'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialise le message d'erreur

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setEmail('');
        setPassword('');
        router.push('/dashboard'); // Redirection après connexion réussie
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Erreur de connexion. Veuillez réessayer.');
      }
    } catch (err) {
      setErrorMessage('Erreur de connexion. Vérifiez votre connexion internet.');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="container mx-auto flex justify-center items-center w-full h-screen bg-[url('/IMG/loginPage/loginBG.svg')] bg-cover bg-center --font-open-sans">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full p-8 bg-white bg-opacity-80 backdrop-blur-xl backdrop-filter lg shadow-lg border border-gray-300 rounded-lg"
      >
        <h2 className="text-center text-black text-3xl font-semibold mb-6">Se connecter</h2>

        <fieldset className="fieldset mb-6">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            className="input w-full p-3 bg-transparent border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset mb-6">
          <legend className="fieldset-legend">Mot de passe</legend>
          <input
            type="password"
            className="input w-full p-3 bg-transparent border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="password123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>

        {errorMessage && (
          <p className="text-red-600 text-center text-sm mb-4">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white border border-blue-600 px-4 py-3 rounded-md shadow-lg hover:bg-blue-600 transition-all"
        >
          <svg aria-label="Email icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="white">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          Se connecter
        </button>
      </form>
    </div>
  );
}
