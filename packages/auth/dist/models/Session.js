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
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    appId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    lastActive: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            if (ret.createdAt)
                ret.createdAt = new Date(ret.createdAt).toISOString();
            if (ret.updatedAt)
                ret.updatedAt = new Date(ret.updatedAt).toISOString();
            if (ret.lastActive)
                ret.lastActive = new Date(ret.lastActive).toISOString();
            if (ret.expiresAt)
                ret.expiresAt = new Date(ret.expiresAt).toISOString();
            return ret;
        }
    }
});
// Update lastActive timestamp on every operation
sessionSchema.pre('save', function (next) {
    this.lastActive = new Date();
    next();
});
// Virtual for checking if session is expired
sessionSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});
// Index for token lookups and expiry checks
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ userId: 1 });
const Session = mongoose_1.default.models.Session || mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    appId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    lastActive: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
// Update lastActive timestamp on every operation
sessionSchema.pre('save', function (next) {
    this.lastActive = new Date();
    next();
});
// Virtual for checking if session is expired
sessionSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});
// Index for token lookups and expiry checks
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ userId: 1 });
const Session = mongoose_1.default.models.Session || mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
const sessionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    lastActive: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
// Update lastActive timestamp on every operation
sessionSchema.pre('save', function (next) {
    this.lastActive = new Date();
    next();
});
// Virtual for checking if session is expired
sessionSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});
// Index for token lookups and expiry checks
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ userId: 1 });
const Session = mongoose_1.default.models.Session || mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
