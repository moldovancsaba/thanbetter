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
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = mongoose_1.default.model('User');
            const existingUser = yield User.findOne({ email: input.email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(input.password, 10);
            const now = new Date().toISOString();
            const user = new User({
                email: input.email,
                password: hashedPassword,
                name: input.name,
                createdAt: now,
                lastLoginAt: now
            });
            yield user.save();
            return user;
        });
    }
    validateUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = mongoose_1.default.model('User');
            const user = yield User.findOne({ email: input.email });
            if (!user) {
                throw new Error('User not found');
            }
            const isValid = yield bcryptjs_1.default.compare(input.password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }
            user.lastLoginAt = new Date().toISOString();
            yield user.save();
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = mongoose_1.default.model('User');
            return User.findById(id);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = mongoose_1.default.model('User');
            return User.findOne({ email });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map