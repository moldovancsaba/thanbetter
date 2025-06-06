"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
class TokenManager {
    static saveTokens(tokens) {
        localStorage.setItem(this.TOKEN_KEY, tokens.access_token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
        localStorage.setItem(this.EXPIRES_AT_KEY, tokens.expires_at);
    }
    static getAccessToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    static getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    static getExpiresAt() {
        return localStorage.getItem(this.EXPIRES_AT_KEY);
    }
    static isTokenExpired() {
        const expiresAt = this.getExpiresAt();
        if (!expiresAt)
            return true;
        return new Date(expiresAt).getTime() <= new Date().getTime();
    }
    static clearTokens() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.EXPIRES_AT_KEY);
    }
}
exports.TokenManager = TokenManager;
TokenManager.TOKEN_KEY = 'auth_token';
TokenManager.REFRESH_TOKEN_KEY = 'auth_refresh_token';
TokenManager.EXPIRES_AT_KEY = 'auth_expires_at';
