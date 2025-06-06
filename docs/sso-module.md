# SSO Module Documentation

Last Updated: 2025-06-05T18:10:44Z

## Overview

This document outlines the Single Sign-On (SSO) module implementation for the ThanPerfect project. The SSO module will serve as a central authentication service for multiple applications.

## MongoDB Configuration

### Connection Details
```
Host: mongodb-thanperfect.zf2o0ix.mongodb.net
Database: thanperfect
Connection URI: mongodb+srv://moldovancsaba:togwa1-xyhcEp-mozceb@mongodb-thanperfect.zf2o0ix.mongodb.net/?retryWrites=true&w=majority&appName=mongodb-thanperfect
```

### Current Setup Verification
```bash
$ mongosh "mongodb+srv://moldovancsaba:togwa1-xyhcEp-mozceb@mongodb-thanperfect.zf2o0ix.mongodb.net/?retryWrites=true&w=majority&appName=mongodb-thanperfect" --eval 'db.adminCommand({listDatabases: 1})'
```

Output:
```json
{
  "databases": [
    { "name": "test", "sizeOnDisk": 487424, "empty": false },
    { "name": "thanperfect", "sizeOnDisk": 503808, "empty": false },
    { "name": "admin", "sizeOnDisk": 364544, "empty": false },
    { "name": "local", "sizeOnDisk": 5986607104, "empty": false }
  ],
  "totalSize": 5987962880,
  "totalSizeMb": 5710,
  "ok": 1
}
```

### User Configuration
```bash
$ mongosh "mongodb+srv://moldovancsaba:togwa1-xyhcEp-mozceb@mongodb-thanperfect.zf2o0ix.mongodb.net/?retryWrites=true&w=majority&appName=mongodb-thanperfect" --eval 'db.getUser("moldovancsaba")'
```

Output:
```json
{
  "_id": "admin.moldovancsaba",
  "user": "moldovancsaba",
  "db": "admin",
  "roles": [ { "role": "atlasAdmin", "db": "admin" } ]
}
```

## Database Schema

### User Schema
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;  // ISO 8601 format
  lastLoginAt: Date; // ISO 8601 format
}
```

### Session Schema
```typescript
interface Session {
  _id: ObjectId;
  userId: ObjectId;
  token: string;
  appId: string;  // identifies which app is using the session
  createdAt: Date; // ISO 8601 format
  expiresAt: Date; // ISO 8601 format
}
```

### Application Schema
```typescript
interface Application {
  _id: ObjectId;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUrls: string[];
  createdAt: Date; // ISO 8601 format
}
```

## API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Get Current Session
```http
GET /api/auth/session
Authorization: Bearer {token}
```

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "newuserpassword",
  "name": "New User"
}
```

### OAuth2-like Endpoints

#### Authorization
```http
GET /api/oauth/authorize
Query Parameters:
  - client_id: string
  - redirect_uri: string
  - response_type: string
  - scope: string
  - state: string
```

#### Token
```http
POST /api/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "auth_code",
  "client_id": "client_id",
  "client_secret": "client_secret",
  "redirect_uri": "https://app.example.com/callback"
}
```

#### User Info
```http
GET /api/oauth/userinfo
Authorization: Bearer {token}
```

## Implementation Plan

### Phase 1: Core Authentication

- [ ] Set up user model and database schema
- [ ] Implement user registration
- [ ] Implement login/logout functionality
- [ ] Add session management
- [ ] Add JWT token handling

### Phase 2: SSO Provider Setup

- [ ] Create application registration system
- [ ] Implement OAuth2-like flow
- [ ] Add authorization endpoint
- [ ] Add token endpoint
- [ ] Add user info endpoint

### Phase 3: Client Integration

- [ ] Create client SDK
- [ ] Add example integration
- [ ] Add documentation
- [ ] Add security guidelines

## Security Considerations

1. CORS Configuration
   - Whitelist allowed domains
   - Handle preflight requests
   - Secure cookie settings

2. Rate Limiting
   - Implement rate limiting for API endpoints
   - Set appropriate limits per endpoint
   - Add retry-after headers

3. Token Security
   - JWT token expiration
   - Refresh token rotation
   - Secure token storage

4. Password Security
   - Bcrypt hashing
   - Password complexity requirements
   - Account lockout after failed attempts

5. Attack Prevention
   - CSRF tokens
   - XSS prevention headers
   - SQL injection protection

## Required Dependencies

```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cookie": "^0.5.0",
    "mongodb": "^6.17.0"
  }
}
```

## Development Setup

1. Install dependencies:
```bash
npm install jsonwebtoken bcryptjs cookie mongodb
```

2. Set up environment variables:
```env
MONGODB_URI=mongodb+srv://moldovancsaba:togwa1-xyhcEp-mozceb@mongodb-thanperfect.zf2o0ix.mongodb.net/?retryWrites=true&w=majority&appName=mongodb-thanperfect
JWT_SECRET=your-jwt-secret-key
COOKIE_SECRET=your-cookie-secret
NODE_ENV=development
```

## Testing

### Unit Tests
- User model methods
- Authentication functions
- Token generation/validation
- Password hashing

### Integration Tests
- API endpoints
- Database operations
- OAuth flows
- Session management

### E2E Tests
- Complete login flow
- Application authorization
- Token exchange
- User info retrieval

## Monitoring

1. Error Tracking
   - Authentication failures
   - Invalid tokens
   - Rate limit hits

2. Performance Metrics
   - Response times
   - Database query times
   - Token validation speed

3. Security Monitoring
   - Failed login attempts
   - Suspicious IP addresses
   - Token misuse

## Client Integration Guide

### Example Client Implementation
```typescript
class SSOClient {
  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async login(email: string, password: string): Promise<string> {
    // Implementation
  }

  async validateToken(token: string): Promise<boolean> {
    // Implementation
  }

  async getUserInfo(token: string): Promise<User> {
    // Implementation
  }
}
```

### Usage Example
```typescript
const sso = new SSOClient('client_id', 'client_secret');

// Login
const token = await sso.login('user@example.com', 'password');

// Get user info
const user = await sso.getUserInfo(token);
```

