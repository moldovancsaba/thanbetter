# SSO Protocol Specification

This document outlines the Single Sign-On (SSO) protocol implementation, including endpoints, required parameters, and response formats.

## Core Endpoints

### 1. Authorization Endpoint

**Endpoint**: `/api/auth/sso/authorize`

**Method**: GET

**Parameters**:
- `client_id` (required): Unique identifier for the client application
- `redirect_uri` (required): URL where the user will be redirected after authentication
- `state` (required): Random string to prevent CSRF attacks
- `response_type` (required): Must be set to "code"
- `scope` (optional): Space-separated list of requested permissions

**Response**:
```
HTTP/1.1 302 Found
Location: {redirect_uri}?code={authorization_code}&state={state}
```

### 2. Token Exchange Endpoint

**Endpoint**: `/api/auth/sso/token`

**Method**: POST

**Parameters**:
- `grant_type` (required): Must be "authorization_code"
- `code` (required): The authorization code received from the authorize endpoint
- `client_id` (required): The client application's ID
- `client_secret` (required): The client application's secret
- `redirect_uri` (required): Must match the redirect_uri used in the authorization request

**Response**:
```json
{
    "access_token": "eyJ...",    // JWT format
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "abc...",
    "issued_at": "2025-04-13T12:34:56.789Z"
}
```

### 3. User Information Endpoint

**Endpoint**: `/api/auth/sso/userinfo`

**Method**: GET

**Headers**:
- `Authorization`: Bearer {access_token}

**Response**:
```json
{
    "sub": "user123",
    "email": "user@example.com",
    "email_verified": true,
    "name": "John Doe",
    "given_name": "John",
    "family_name": "Doe",
    "picture": "https://example.com/profile.jpg",
    "updated_at": "2025-04-13T12:34:56.789Z"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
    "error": "error_code",
    "error_description": "A human-readable error description",
    "error_uri": "https://example.com/docs/errors"
}
```

Common error codes:
- `invalid_request`: The request is missing required parameters
- `unauthorized_client`: The client is not authorized to request an authorization code
- `access_denied`: The resource owner denied the request
- `invalid_grant`: The provided authorization code is invalid or expired
- `server_error`: Internal server error

## Security Considerations

1. All endpoints MUST be accessed over HTTPS
2. Authorization codes are single-use and short-lived (max 10 minutes)
3. Access tokens are valid for 1 hour
4. Refresh tokens are valid for 30 days
5. The `state` parameter must be cryptographically secure random string
6. Clients must validate the `state` parameter matches their original request
7. All timestamps follow ISO 8601 format with millisecond precision

