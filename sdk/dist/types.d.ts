export interface AuthConfig {
    apiUrl: string;
    clientId: string;
    clientSecret?: string;
}
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_at: string;
    token_type: string;
}
export interface UserInfo {
    id: string;
    email: string;
    name?: string;
    created_at: string;
}
export interface AuthError extends Error {
    code: string;
    status?: number;
}
