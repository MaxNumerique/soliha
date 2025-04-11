'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import DashboardLayout from '@/components/DashboardLayout';
import { MdEdit, MdDelete, MdMail } from 'react-icons/md';
import FormInput from '@/components/FormInput';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminPage() {
  const { users, roles, notification, addUser, editUser, deleteUser, handleResetPassword } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <DashboardLayout>
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {notification}
        </div>
      )}

      {/* Bouton Ajouter */}
      <button className="btn btn-primary btn-sm p-2 mb-4" onClick={() => setIsModalOpen(true)}>
        Ajouter
      </button>

      {/* Tableau des utilisateurs */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles?.map(role => role.name).join(', ') || 'Aucun rôle'}</td>
              <td className="flex gap-2">
                <button onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }} className="btn btn-sm btn-ghost">
                  <MdEdit className="text-xl text-blue-500" />
                </button>
                <button onClick={() => { setSelectedUser(user.id); setIsDeleteModalOpen(true); }} className="btn btn-sm btn-ghost">
                  <MdDelete className="text-xl text-red-500" />
                </button>
                <button onClick={() => handleResetPassword(user.email)} className="btn btn-sm btn-ghost">
                  <MdMail className="text-xl text-green-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modale Ajouter */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Ajouter un utilisateur"
      >
        <UserForm
          user={newUser}
          roles={roles}
          onSubmit={(data) => addUser(data, () => setIsModalOpen(false))}
          onChange={setNewUser}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Modale Modifier */}
      {selectedUser && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          title="Modifier l'utilisateur"
        >
          <UserForm
            user={selectedUser}
            roles={roles}
            onSubmit={(data) => editUser(data, () => setIsEditModalOpen(false))}
            onChange={setSelectedUser}
            onClose={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}

      {/* Modale Supprimer */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteUser(selectedUser, () => setIsDeleteModalOpen(false))}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
      />
    </DashboardLayout>
  );
}

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const UserForm = ({ user, roles, onSubmit, onChange, onClose }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(user); }}>
    <FormInput
      label="Nom"
      type="text"
      value={user.name}
      onChange={(e) => onChange({ ...user, name: e.target.value })}
      required
    />
    <FormInput
      label="Email"
      type="email"
      value={user.email}
      onChange={(e) => onChange({ ...user, email: e.target.value })}
      required
    />
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
      <select 
        className="select select-bordered w-full select-sm" 
        value={user.role} 
        onChange={(e) => onChange({ ...user, role: e.target.value })} 
        required
      >
        {roles.map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}
      </select>
    </div>
    <div className="flex justify-between mt-6">
      <button type="button" className="btn btn-sm btn-ghost" onClick={onClose}>
        Annuler
      </button>
      <button type="submit" className="btn btn-sm btn-primary">
        Valider
      </button>
    </div>
  </form>
);
