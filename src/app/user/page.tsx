import { useState, useEffect } from 'react';

export default function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/users');
      const users = await response.json();
      setUsers(users);
    }
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Username</th>
            <th>Created At</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.createdAt}</td>
              <td>{user.lastLogin}</td>
              <td>
                {/* Edit and Delete Actions */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

