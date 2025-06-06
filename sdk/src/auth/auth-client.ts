import axios, { AxiosInstance } from 'axios';
import { AuthConfig, TokenResponse, UserInfo, AuthError } from '../types';
import { TokenManager } from './token-manager';

export class AuthClient {
  private readonly config: AuthConfig;
  private readonly axiosInstance: AxiosInstance;

  constructor(config: AuthConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for token management
    this.axiosInstance.interceptors.request.use(async (config) => {
      const token = TokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public async login(email: string, password: string): Promise<TokenResponse> {
    try {
      const response = await this.axiosInstance.post<TokenResponse>('/auth/login', {
        email,
        password,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      });

      TokenManager.saveTokens(response.data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async refreshToken(): Promise<TokenResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.axiosInstance.post<TokenResponse>('/auth/refresh', {
        refresh_token: refreshToken,
        client_id: this.config.clientId,
      });

      TokenManager.saveTokens(response.data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async getUserInfo(): Promise<UserInfo> {
    try {
      if (TokenManager.isTokenExpired()) {
        await this.refreshToken();
      }

      const response = await this.axiosInstance.get<UserInfo>('/auth/user');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public logout(): void {
    TokenManager.clearTokens();
  }

  private handleError(error: any): AuthError {
    const authError: AuthError = new Error(error.response?.data?.message || error.message) as AuthError;
    authError.code = error.response?.data?.code || 'unknown_error';
    authError.status = error.response?.status;
    return authError;
  }
}

