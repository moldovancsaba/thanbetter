# ThanPerfect Authentication Flows

## 1. Admin/Maintenance Flow

### Purpose
Provide direct access to user management and authentication logs for maintenance purposes.

### Flow Steps
1. User visits ThanPerfect homepage (`/`)
2. Enters username in the login form
3. Upon successful authentication:
   - User is redirected to `/admin`
   - Gets access to user management and logs

### Features
- Direct login from homepage
- User management (CRUD operations)
- Authentication logs viewing
- Session management

## 2. SSO (Single Sign-On) Flow

### Purpose
Provide OAuth-like authentication for external applications while maintaining simplicity.

### Flow Steps
1. User visits external application
2. Clicks "Login with ThanPerfect"
3. Redirected to ThanPerfect SSO page (`/sso/login`)
4. Enters username
5. Upon successful authentication:
   - ThanPerfect generates authentication token
   - User is redirected back to external application
   - External application receives user information

### Technical Implementation

#### OAuth Flow
1. Client Application Registration
   ```
   POST /api/client-applications
   {
     "name": "Test App",
     "redirectUris": ["http://localhost:3001/callback"]
   }
   ```

2. Authorization Request
   ```
   GET /sso/authorize
   ?client_id=<client_id>
   &redirect_uri=<redirect_uri>
   &response_type=code
   &state=<state>
   ```

3. Token Exchange
   ```
   POST /api/oauth/token
   {
     "grant_type": "authorization_code",
     "code": "<auth_code>",
     "client_id": "<client_id>",
     "client_secret": "<client_secret>",
     "redirect_uri": "<redirect_uri>"
   }
   ```

4. User Info Retrieval
   ```
   GET /api/oauth/userinfo
   Authorization: Bearer <access_token>
   ```

### Testing the SSO Flow
1. From ThanPerfect homepage, click "Test SSO"
2. Redirected to test client application
3. Click "Login with ThanPerfect"
4. Complete authentication
5. Verify successful return to test application

## Security Considerations

### Admin Flow
- Protected routes under `/admin/*`
- Session-based authentication
- Activity logging

### SSO Flow
- Secure token generation and validation
- HTTPS-only communication
- State parameter validation
- Registered redirect URI validation

## Integration Guide

### 1. Register Client Application
1. Access ThanPerfect admin dashboard
2. Navigate to "Client Applications"
3. Click "Create New Application"
4. Note `client_id` and `client_secret`

### 2. Implement OAuth Flow
1. Add "Login with ThanPerfect" button
2. Implement authorization code flow
3. Handle token exchange
4. Fetch and use user information

### 3. Test Integration
1. Use test environment first
2. Verify error handling
3. Check token refresh flow
4. Validate user data handling

