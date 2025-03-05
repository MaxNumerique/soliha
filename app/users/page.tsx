'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  // Fonction pour récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        // Si la requête échoue, redirige vers la page d'accueil ou la page de connexion
        router.push('/login');
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin - Gérer les utilisateurs</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) - {user.roles.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
