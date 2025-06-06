"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    createApplication(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = {
                _id: new mongodb_1.ObjectId(),
                name: input.name,
                clientId: this.generateClientId(),
                clientSecret: this.generateClientSecret(),
                redirectUrls: input.redirectUrls,
                createdAt: new Date()
            };
            const Application = mongoose_1.default.model('Application');
            yield Application.create(application);
            return application;
        });
    }
    validateApplication(clientId, clientSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            const Application = mongoose_1.default.model('Application');
            return Application.findOne({
                clientId,
                clientSecret
            });
        });
    }
    getApplicationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const Application = mongoose_1.default.model('Application');
            return Application.findById(id);
        });
    }
    getApplicationByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Application = mongoose_1.default.model('Application');
            return Application.findOne({ clientId });
        });
    }
    validateRedirectUrl(clientId, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield this.getApplicationByClientId(clientId);
            if (!application)
                return false;
            return application.redirectUrls.includes(redirectUrl);
        });
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=ApplicationService.js.map