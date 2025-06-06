# API Reference

## AuthClient

### Constructor

```typescript
new AuthClient(config: AuthConfig)
```

#### AuthConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| apiUrl | string | Yes | Base URL for the authentication API |
| clientId | string | Yes | Client application identifier |
| clientSecret | string | No | Client secret for enhanced security |

### Methods

#### login

```typescript
async login(email: string, password: string): Promise<TokenResponse>
```

Authenticates a user with their credentials.

#### refreshToken

```typescript
async refreshToken(): Promise<TokenResponse>
```

Refreshes the access token using the stored refresh token.

#### getUserInfo

```typescript
async getUserInfo(): Promise<UserInfo>
```

Retrieves the authenticated user's information.

#### logout

```typescript
logout(): void
```

Clears all stored authentication tokens.

## Types

### TokenResponse

```typescript
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string; // ISO 8601 format: 2025-04-13T12:34:56.789Z
  token_type: string;
}
```

### UserInfo

```typescript
interface UserInfo {
  id: string;
  email: string;
  name?: string;
  created_at: string; // ISO 8601 format: 2025-04-13T12:34:56.789Z
}
```

### AuthError

```typescript
interface AuthError extends Error {
  code: string;
  status?: number;
}
```

