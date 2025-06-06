import { AuthConfig, TokenResponse, UserInfo } from '../types';
export declare class AuthClient {
    private readonly config;
    private readonly axiosInstance;
    constructor(config: AuthConfig);
    login(email: string, password: string): Promise<TokenResponse>;
    refreshToken(): Promise<TokenResponse>;
    getUserInfo(): Promise<UserInfo>;
    logout(): void;
    private handleError;
}
