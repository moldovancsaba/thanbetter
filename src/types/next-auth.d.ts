import 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    createdAt: string;
    lastLoginAt: string;
  }

  interface Session {
    user: {
      username: string;
      createdAt: string;
      lastLoginAt: string;
    } & DefaultSession['user'];
  }
}

