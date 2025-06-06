import { TokenResponse } from '../types';
export declare class TokenManager {
    private static readonly TOKEN_KEY;
    private static readonly REFRESH_TOKEN_KEY;
    private static readonly EXPIRES_AT_KEY;
    static saveTokens(tokens: TokenResponse): void;
    static getAccessToken(): string | null;
    static getRefreshToken(): string | null;
    static getExpiresAt(): string | null;
    static isTokenExpired(): boolean;
    static clearTokens(): void;
}
