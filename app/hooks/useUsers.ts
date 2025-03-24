import { useState, useEffect } from 'react';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/admin/users');
    if (response.ok) {
      const data = await response.json();
      setUsers(data.users);
    }
  };

  const fetchRoles = async () => {
    const response = await fetch('/api/admin/roles');
    if (response.ok) {
      const data = await response.json();
      setRoles(data.roles);
    }
  };

  const addUser = async (newUser, callback) => {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      setNotification('Utilisateur ajouté avec succès !');
      fetchUsers();
      callback(); // Fermer la modale
    } else {
      const data = await response.json();
      setNotification(data.error || 'Erreur lors de l\'ajout');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const editUser = async (updatedUser, callback) => {
    const response = await fetch(`/api/admin/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      setNotification('Utilisateur modifié avec succès !');
      fetchUsers();
      callback();
    } else {
      setNotification('Erreur lors de la modification');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const deleteUser = async (userId, callback) => {
    const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });

    if (response.ok) {
      setNotification('Utilisateur supprimé avec succès !');
      fetchUsers();
      callback();
    } else {
      setNotification('Erreur lors de la suppression');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleResetPassword = async (email) => {
    console.log("📩 Envoi de la requête pour reset password de :", email);
  
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  
    console.log("📡 Réponse brute :", response);
    const data = await response.json();
    console.log("📡 Données reçues :", data);
  
    if (response.ok) {
      setNotification('Email de réinitialisation envoyé !');
    } else {
      setNotification(data.error || 'Erreur lors de l\'envoi de l\'email');
    }
  
    setTimeout(() => setNotification(''), 3000);
  };
  
  
  

  return { users, roles, notification, addUser, editUser, deleteUser, handleResetPassword };
}
