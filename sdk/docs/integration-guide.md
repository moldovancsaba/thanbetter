# Authentication SDK Integration Guide

## Installation

```bash
npm install auth-sdk
# or
yarn add auth-sdk
```

## Quick Start

```typescript
import { AuthClient } from 'auth-sdk';

const auth = new AuthClient({
  apiUrl: 'https://api.example.com',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret' // Optional
});

// Login
try {
  const tokens = await auth.login('user@example.com', 'password');
  console.log('Login successful', tokens);
} catch (error) {
  console.error('Login failed:', error);
}

// Get user info
try {
  const userInfo = await auth.getUserInfo();
  console.log('User info:', userInfo);
} catch (error) {
  console.error('Failed to get user info:', error);
}

// Logout
auth.logout();
```

## Token Management

The SDK automatically handles:
- Token storage in localStorage
- Token refresh when expired
- Authorization header injection

## Error Handling

All API errors are wrapped in an `AuthError` type with:
- `message`: Error description
- `code`: Error code
- `status`: HTTP status code

## Best Practices

1. Initialize the AuthClient once and reuse the instance
2. Handle token refresh automatically before requests
3. Implement proper error handling
4. Secure storage of client credentials

