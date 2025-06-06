# Example Implementations

## Basic Authentication Flow

```typescript
import { AuthClient } from 'auth-sdk';

// Initialize the client
const auth = new AuthClient({
  apiUrl: 'https://api.example.com',
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET
});

// Login form handler
async function handleLogin(email: string, password: string) {
  try {
    const tokens = await auth.login(email, password);
    console.log('Login successful');
    
    // Get user info after successful login
    const userInfo = await auth.getUserInfo();
    console.log('User info:', userInfo);
    
    return userInfo;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

// Logout handler
function handleLogout() {
  auth.logout();
  // Redirect to login page or update UI state
}
```

## React Integration

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient, UserInfo } from 'auth-sdk';

// Create auth context
const AuthContext = createContext<{
  user: UserInfo | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>(null!);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const auth = new AuthClient({
    apiUrl: process.env.REACT_APP_API_URL!,
    clientId: process.env.REACT_APP_CLIENT_ID!
  });

  useEffect(() => {
    // Check authentication status on mount
    auth.getUserInfo()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const login = async (email: string, password: string) => {
    await auth.login(email, password);
    const userInfo = await auth.getUserInfo();
    setUser(userInfo);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth
export function useAuth() {
  return useContext(AuthContext);
}
```

## Vue.js Integration

```typescript
import { defineStore } from 'pinia';
import { AuthClient, UserInfo } from 'auth-sdk';

const auth = new AuthClient({
  apiUrl: import.meta.env.VITE_API_URL,
  clientId: import.meta.env.VITE_CLIENT_ID
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfo | null
  }),
  
  actions: {
    async login(email: string, password: string) {
      await auth.login(email, password);
      this.user = await auth.getUserInfo();
    },
    
    logout() {
      auth.logout();
      this.user = null;
    },
    
    async checkAuth() {
      try {
        this.user = await auth.getUserInfo();
      } catch {
        this.user = null;
      }
    }
  }
});
```

## Next.js API Route

```typescript
// pages/api/auth/[...auth].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthClient } from 'auth-sdk';

const auth = new AuthClient({
  apiUrl: process.env.API_URL!,
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const tokens = await auth.login(email, password);
    const user = await auth.getUserInfo();

    // Set HTTP-only cookie with refresh token
    res.setHeader('Set-Cookie', [
      `refreshToken=${tokens.refresh_token}; HttpOnly; Path=/; SameSite=Strict`
    ]);

    res.status(200).json({ user, accessToken: tokens.access_token });
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message,
      code: error.code
    });
  }
}
```

