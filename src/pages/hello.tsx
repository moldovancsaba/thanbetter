import { GetServerSideProps } from 'next';
import { useState } from 'react';
import connectToDatabase from '../lib/mongodb';
import User from '../models/User';
import { logger } from '../utils/logger';

interface UserData {
  _id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface Props {
  users: UserData[];
}

export default function Hello({ users: initialUsers }: Props) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');

  const handleEdit = async (id: string) => {
    if (editingId === id) {
      try {
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, username: editUsername })
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        const updatedUser = await response.json();
        setUsers(users.map(user => user._id === id ? { ...user, username: editUsername } : user));
        setEditingId(null);
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    } else {
      const user = users.find(u => u._id === id);
      if (user) {
        setEditUsername(user.username);
        setEditingId(id);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Users</h1>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {editingId === user._id ? (
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <div className="text-lg font-medium">{user.username}</div>
                )}
                <div className="text-sm text-gray-500 mt-1">
                  <div>Created: {user.createdAt}</div>
                  <div>Updated: {user.updatedAt}</div>
                  {user.lastLoginAt && <div>Last Login: {user.lastLoginAt}</div>}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(user._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  {editingId === user._id ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await connectToDatabase();
  const users = await User.find({}).select('_id username createdAt updatedAt lastLoginAt');
  
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
};
