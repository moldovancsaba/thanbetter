"use strict";
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
    async createSession(user, appId) {
        const Session = mongoose_1.default.model('Session');
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
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
        await session.save();
        return session;
    }
    async validateSession(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            const Session = mongoose_1.default.model('Session');
            const session = await Session.findOne({
                userId: new mongodb_1.ObjectId(decoded.userId),
                appId: decoded.appId,
                token,
                expiresAt: { $gt: new Date() },
                isActive: true
            });
            if (session) {
                session.lastActive = new Date();
                await session.save();
            }
            return session;
        }
        catch (error) {
            return null;
        }
    }
    async invalidateSession(token) {
        const Session = mongoose_1.default.model('Session');
        await Session.updateOne({ token }, { $set: { isActive: false } });
    }
    async invalidateAllUserSessions(userId) {
        const Session = mongoose_1.default.model('Session');
        await Session.updateMany({ userId }, { $set: { isActive: false } });
    }
}
exports.SessionService = SessionService;
