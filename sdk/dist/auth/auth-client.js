"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const axios_1 = __importDefault(require("axios"));
const token_manager_1 = require("./token-manager");
class AuthClient {
    constructor(config) {
        this.config = config;
        this.axiosInstance = axios_1.default.create({
            baseURL: config.apiUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor for token management
        this.axiosInstance.interceptors.request.use(async (config) => {
            const token = token_manager_1.TokenManager.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }
    async login(email, password) {
        try {
            const response = await this.axiosInstance.post('/auth/login', {
                email,
                password,
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
            });
            token_manager_1.TokenManager.saveTokens(response.data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async refreshToken() {
        const refreshToken = token_manager_1.TokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        try {
            const response = await this.axiosInstance.post('/auth/refresh', {
                refresh_token: refreshToken,
                client_id: this.config.clientId,
            });
            token_manager_1.TokenManager.saveTokens(response.data);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getUserInfo() {
        try {
            if (token_manager_1.TokenManager.isTokenExpired()) {
                await this.refreshToken();
            }
            const response = await this.axiosInstance.get('/auth/user');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    logout() {
        token_manager_1.TokenManager.clearTokens();
    }
    handleError(error) {
        var _a, _b, _c, _d, _e;
        const authError = new Error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message);
        authError.code = ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.code) || 'unknown_error';
        authError.status = (_e = error.response) === null || _e === void 0 ? void 0 : _e.status;
        return authError;
    }
}
exports.AuthClient = AuthClient;
