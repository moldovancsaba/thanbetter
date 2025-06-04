# Simple Login Module Documentation

Last Updated: 2025-06-04T19:57:56.000Z

## Overview
A simple authentication system built with Next.js and TypeScript that allows users to log in with a username. The system stores user registration timestamps and maintains a list of all registered users.

## Technology Stack
- Next.js 15.3.3
- TypeScript
- Tailwind CSS (for styling)
- File-based JSON storage

## Implementation Details

### User Data Structure
```typescript
interface User {
  username: string;
  registrationTime: string;  // ISO 8601 format with milliseconds
}
```

### Authentication Flow
1. User enters username on the login page
2. Frontend sends POST request to /api/auth
3. Backend checks if user exists:
   - If new user: adds to users.json with registration timestamp
   - If existing user: allows login
4. User is redirected to /hello page showing all registered users

### Key Components

#### LoginForm Component (src/components/LoginForm.tsx)
```typescript
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim() })
    });

    if (response.ok) {
      router.push('/hello');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}
```

### API Documentation

POST /api/auth
Authenticates or registers a user.

Request Body:
```json
{
  "username": "string"
}
```

Responses:
- 200 OK: Successfully authenticated
- 405 Method Not Allowed: Wrong HTTP method
- 500 Internal Server Error: Server error

### Current Limitations
1. No password authentication
2. File-based storage isn't suitable for production
3. No session management
4. No protection against username spoofing

### Security Considerations
- Basic implementation without password protection
- No session management
- No encryption for data transmission
- Limited to development environment only

## Development Timeline
- Initial Implementation: 2025-06-04T19:41:52.000Z
- Latest Update: 2025-06-04T19:57:56.000Z
- Planned Security Upgrade: 2025-07-04T00:00:00.000Z
