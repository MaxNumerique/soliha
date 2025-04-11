import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { successNotification, errorNotification } from '../components/Notification';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error(error.message, errorNotification(error.message));
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des rôles');
      }
      const data = await response.json();
      setRoles(data.roles);
    } catch (error) {
      toast.error(error.message, errorNotification(error.message));
    }
  };

  const addUser = async (newUser, callback) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'utilisateur');
      }

      toast.success('Utilisateur ajouté avec succès !', successNotification('Utilisateur ajouté avec succès !'));
      await fetchUsers();
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de l\'ajout de l\'utilisateur'));
    }
  };

  const editUser = async (updatedUser, callback) => {
    try {
      const response = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la modification de l\'utilisateur');
      }

      toast.success('Utilisateur modifié avec succès !', successNotification('Utilisateur modifié avec succès !'));
      await fetchUsers();
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de la modification de l\'utilisateur'));
    }
  };

  const deleteUser = async (userId, callback) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression de l\'utilisateur');
      }

      toast.success('Utilisateur supprimé avec succès !', successNotification('Utilisateur supprimé avec succès !'));
      await fetchUsers();
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de la suppression de l\'utilisateur'));
    }
  };

  const handleResetPassword = async (email, callback) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'email');
      }

      toast.success('Email de réinitialisation envoyé !', successNotification('Email de réinitialisation envoyé !'));
      callback?.();
    } catch (error) {
      toast.error(error.message, errorNotification(error.message || 'Erreur lors de l\'envoi de l\'email'));
    }
  };

  return {
    users,
    roles,
    notification,
    fetchUsers,
    fetchRoles,
    addUser,
    editUser,
    deleteUser,
    handleResetPassword,
  };
}
