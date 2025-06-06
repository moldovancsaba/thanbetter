"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const mongodb_1 = require("mongodb");
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
class ApplicationService {
    constructor() { }
    static getInstance() {
        if (!ApplicationService.instance) {
            ApplicationService.instance = new ApplicationService();
        }
        return ApplicationService.instance;
    }
    generateClientId() {
        return crypto_1.default.randomBytes(16).toString('hex');
    }
    generateClientSecret() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
    async createApplication(input) {
        const application = {
            _id: new mongodb_1.ObjectId(),
            name: input.name,
            clientId: this.generateClientId(),
            clientSecret: this.generateClientSecret(),
            redirectUrls: input.redirectUrls,
            createdAt: new Date()
        };
        const Application = mongoose_1.default.model('Application');
        await Application.create(application);
        return application;
    }
    async validateApplication(clientId, clientSecret) {
        const Application = mongoose_1.default.model('Application');
        return Application.findOne({
            clientId,
            clientSecret
        });
    }
    async getApplicationById(id) {
        const Application = mongoose_1.default.model('Application');
        return Application.findById(id);
    }
    async getApplicationByClientId(clientId) {
        const Application = mongoose_1.default.model('Application');
        return Application.findOne({ clientId });
    }
    async validateRedirectUrl(clientId, redirectUrl) {
        const application = await this.getApplicationByClientId(clientId);
        if (!application)
            return false;
        return application.redirectUrls.includes(redirectUrl);
    }
}
exports.ApplicationService = ApplicationService;
