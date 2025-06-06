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
exports.SessionService = void 0;
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
class SessionService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
    }
    static getInstance() {
        if (!SessionService.instance) {
            SessionService.instance = new SessionService();
        }
        return SessionService.instance;
    }
    createSession(user, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Session = mongoose_1.default.model('Session');
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const token = jsonwebtoken_1.default.sign({
                userId: user._id.toString(),
                appId
            }, this.jwtSecret, { expiresIn: '24h' });
            const session = new Session({
                userId: user._id,
                token,
                appId,
                createdAt: now,
                expiresAt,
                lastActive: now,
                isActive: true
            });
            yield session.save();
            return session;
        });
    }
    validateSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
                const Session = mongoose_1.default.model('Session');
                const session = yield Session.findOne({
                    userId: new mongodb_1.ObjectId(decoded.userId),
                    appId: decoded.appId,
                    token,
                    expiresAt: { $gt: new Date() },
                    isActive: true
                });
                if (session) {
                    session.lastActive = new Date();
                    yield session.save();
                }
                return session;
            }
            catch (error) {
                return null;
            }
        });
    }
    invalidateSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const Session = mongoose_1.default.model('Session');
            yield Session.updateOne({ token }, { $set: { isActive: false } });
        });
    }
    invalidateAllUserSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Session = mongoose_1.default.model('Session');
            yield Session.updateMany({ userId }, { $set: { isActive: false } });
        });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map