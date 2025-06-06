"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
class UserService {
    constructor() { }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    async createUser(input) {
        const User = mongoose_1.default.model('User');
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(input.password, 10);
        const now = new Date().toISOString();
        const user = new User({
            email: input.email,
            password: hashedPassword,
            name: input.name,
            createdAt: now,
            lastLoginAt: now
        });
        await user.save();
        return user;
    }
    async validateUser(input) {
        const User = mongoose_1.default.model('User');
        const user = await User.findOne({ email: input.email });
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await bcryptjs_1.default.compare(input.password, user.password);
        if (!isValid) {
            throw new Error('Invalid password');
        }
        // Update last login time
        user.lastLoginAt = new Date().toISOString();
        await user.save();
        return user;
    }
    async getUserById(id) {
        const User = mongoose_1.default.model('User');
        return User.findById(id);
    }
    async getUserByEmail(email) {
        const User = mongoose_1.default.model('User');
        return User.findOne({ email });
    }
}
exports.UserService = UserService;
