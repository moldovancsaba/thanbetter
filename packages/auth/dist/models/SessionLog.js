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
const sessionLogSchema = new mongoose_1.Schema({
    sessionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventType: {
        type: String,
        enum: ['LOGIN', 'LOGOUT', 'EXPIRED'],
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    metadata: {
        userAgent: String,
        ip: String,
        reason: String
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            if (ret.timestamp)
                ret.timestamp = new Date(ret.timestamp).toISOString();
            if (ret.createdAt)
                ret.createdAt = new Date(ret.createdAt).toISOString();
            if (ret.updatedAt)
                ret.updatedAt = new Date(ret.updatedAt).toISOString();
            return ret;
        }
    }
});
// Indexes for querying logs
sessionLogSchema.index({ sessionId: 1 });
sessionLogSchema.index({ userId: 1 });
sessionLogSchema.index({ timestamp: -1 });
const SessionLog = mongoose_1.default.models.SessionLog || mongoose_1.default.model('SessionLog', sessionLogSchema);
exports.default = SessionLog;
const sessionLogSchema = new mongoose_1.Schema({
    sessionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventType: {
        type: String,
        enum: ['LOGIN', 'LOGOUT', 'EXPIRED'],
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    metadata: {
        userAgent: String,
        ip: String,
        reason: String
    }
});
// Indexes for querying logs
sessionLogSchema.index({ sessionId: 1 });
sessionLogSchema.index({ userId: 1 });
sessionLogSchema.index({ timestamp: -1 });
const SessionLog = mongoose_1.default.models.SessionLog || mongoose_1.default.model('SessionLog', sessionLogSchema);
exports.default = SessionLog;
const sessionLogSchema = new mongoose_1.default.Schema({
    sessionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventType: {
        type: String,
        enum: ['LOGIN', 'LOGOUT', 'EXPIRED'],
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    metadata: {
        userAgent: String,
        ip: String,
        reason: String
    }
});
// Indexes for querying logs
sessionLogSchema.index({ sessionId: 1 });
sessionLogSchema.index({ userId: 1 });
sessionLogSchema.index({ timestamp: -1 });
const SessionLog = mongoose_1.default.models.SessionLog || mongoose_1.default.model('SessionLog', sessionLogSchema);
exports.default = SessionLog;
