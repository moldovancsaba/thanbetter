"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        sparse: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        get: (v) => v.toISOString()
    },
    lastLoginAt: {
        type: Date,
        default: null,
        get: (v) => v ? v.toISOString() : null
    }
}, {
    timestamps: true,
    toJSON: {
        getters: true,
        transform: (doc, ret) => {
            if (ret.createdAt)
                ret.createdAt = new Date(ret.createdAt).toISOString();
            if (ret.updatedAt)
                ret.updatedAt = new Date(ret.updatedAt).toISOString();
            if (ret.lastLoginAt)
                ret.lastLoginAt = new Date(ret.lastLoginAt).toISOString();
            return ret;
        }
    }
});
const User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map