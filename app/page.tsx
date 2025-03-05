"use client";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold underline">TITRE</h1>
      </header>
      <section>
        <p className="text-lg">Bienvenue sur notre site !</p>
        <p className="mt-4 text-sm">Explorez nos services et découvrez nos projets.</p>
      </section>
    </main>
  );
}

