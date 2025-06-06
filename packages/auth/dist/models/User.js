"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    lastLoginAt: {
        type: Date,
        required: true,
        default: () => new Date()
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            delete ret.password;
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
userSchema.index({ email: 1 }, { unique: true });
const User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.default = User;
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    lastLoginAt: {
        type: Date,
        default: () => new Date(),
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});
const User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.default = User;
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
            // Ensure timestamps are in ISO 8601 format
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
