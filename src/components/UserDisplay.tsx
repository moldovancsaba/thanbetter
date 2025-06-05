import React, { useState } from 'react';
import { format } from 'date-fns';

interface UserDisplayProps {
  id: string;
  username: string;
  createdAt: string;
  lastLoginAt?: string;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, newUsername: string) => Promise<void>;
}

export default function UserDisplay({ 
  id,
  username, 
  createdAt, 
  lastLoginAt,
  onDelete,
  onEdit 
}: UserDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleEditClick = async () => {
    if (isEditing) {
      if (editedUsername.trim() === '') {
        alert('Username cannot be empty');
        return;
      }
      try {
        await onEdit(id, editedUsername);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to edit user:', error);
        alert(error instanceof Error ? error.message : 'Failed to edit user');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(id);
      setIsConfirmingDelete(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete user');
      setIsConfirmingDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <li className="user-list-item border p-4 rounded flex justify-between items-center">
      <div className="flex-1">
        <div className="username-container flex items-center gap-4">
          {isEditing ? (
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="border rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <span className="username-text font-medium">{username}</span>
          )}
        </div>
        <div className="user-details text-sm text-gray-600 mt-1">
          <div>Created: {format(new Date(createdAt), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')}</div>
          {lastLoginAt && (
            <div>Last Login: {format(new Date(lastLoginAt), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleEditClick}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        {!isConfirmingDelete ? (
          <button
            onClick={handleDeleteClick}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        ) : (
          <>
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Confirm Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </li>
  );
}
