export interface AuthConfig {
  apiUrl: string;
  clientId: string;
  clientSecret?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string; // ISO 8601 format with milliseconds
  token_type: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  created_at: string; // ISO 8601 format with milliseconds
}

export interface AuthError extends Error {
  code: string;
  status?: number;
}

