# @thanperfect/auth

A simple and beautiful user authentication and session management system for Next.js applications.

## Features

- User management (create, read, update, delete)
- Session management with token-based authentication
- Session logging with detailed activity tracking
- TypeScript support
- MongoDB integration

## Installation

```bash
npm install @thanperfect/auth
```

## Usage

1. Set up environment variables in your .env.local:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

2. Initialize the database connection:

```typescript
import { connectToDatabase } from '@thanperfect/auth';

await connectToDatabase();
```

3. Protect your API routes with authentication:

```typescript
// pages/api/protected-route.ts
import { withAuth, AuthenticatedRequest } from '@thanperfect/auth';
import type { NextApiResponse } from 'next';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Access authenticated user ID
  const userId = req.session?.userId;

  // Your route logic here
}

export default withAuth(handler);
```

4. User Management:

```typescript
import { User } from '@thanperfect/auth';

// Create a user
const user = await User.create({
  username: 'johndoe',
  email: 'john@example.com'
});

// Find a user
const user = await User.findById(userId);

// Update a user
const updatedUser = await User.findByIdAndUpdate(
  userId,
  { username: 'newusername' },
  { new: true }
);

// Delete a user
await User.findByIdAndDelete(userId);
```

5. Session Management:

```typescript
import { SessionService } from '@thanperfect/auth';

// Create a session
const token = await SessionService.createSession(userId);

// Validate a session
const session = await SessionService.validateSession(token);

// End a session
await SessionService.endSession(token);
```

## API Reference

### Models

#### User
- `username`: string (required, unique)
- `email`: string (optional)
- `createdAt`: ISO 8601 string
- `updatedAt`: ISO 8601 string
- `lastLoginAt`: ISO 8601 string (optional)

#### Session
- `userId`: ObjectId (reference to User)
- `token`: string
- `createdAt`: Date
- `expiresAt`: Date
- `lastActive`: Date
- `isActive`: boolean

#### SessionLog
- `sessionId`: ObjectId (reference to Session)
- `userId`: ObjectId (reference to User)
- `eventType`: 'LOGIN' | 'LOGOUT' | 'EXPIRED'
- `timestamp`: Date
- `metadata`: Object (userAgent, ip, reason)

### Middleware

#### withAuth
Protects API routes by requiring a valid session token.

```typescript
withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>)
```

### Services

#### SessionService
- `createSession(userId: string): Promise<string>`
- `validateSession(token: string): Promise<Session | null>`
- `endSession(token: string): Promise<void>`

### Utilities

#### validateUsername
Validates username according to the defined rules.

```typescript
validateUsername(username: string): { valid: boolean; error?: string }
```

## License

MIT

