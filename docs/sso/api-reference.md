# SSO API Reference

## API Endpoints

### Authentication

#### Initiate Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "client_id": "string",
  "redirect_uri": "string",
  "state": "string",
  "scope": "string"
}
```

#### Token Exchange
```http
POST /api/v1/auth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "string",
  "client_id": "string",
  "client_secret": "string"
}
```

### User Management

#### Get User Profile
```http
GET /api/v1/users/me
Authorization: Bearer {access_token}
```

#### Update User Profile
```http
PATCH /api/v1/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "string",
  "email": "string"
}
```

## Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Server Error |

## Error Handling

All error responses follow this format:
```json
{
  "error": "error_code",
  "message": "Human readable message",
  "details": {}
}
```

## Rate Limiting
- 1000 requests per minute per client
- Exceeded limits return 429 Too Many Requests
- Rate limit headers included in all responses
