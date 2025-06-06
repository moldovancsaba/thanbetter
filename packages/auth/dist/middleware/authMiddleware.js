"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuth = void 0;
const SessionService_1 = require("../services/SessionService");
const UserService_1 = require("../services/UserService");
const withAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const sessionService = SessionService_1.SessionService.getInstance();
        const session = await sessionService.validateSession(token);
        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        const userService = UserService_1.UserService.getInstance();
        const user = await userService.getUserById(session.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Attach user and session to request
        req.user = user;
        req.session = session;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};
exports.withAuth = withAuth;
