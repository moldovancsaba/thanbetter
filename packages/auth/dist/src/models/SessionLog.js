"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
sessionLogSchema.index({ sessionId: 1 });
sessionLogSchema.index({ userId: 1 });
sessionLogSchema.index({ timestamp: -1 });
const SessionLog = mongoose_1.default.models.SessionLog || mongoose_1.default.model('SessionLog', sessionLogSchema);
exports.default = SessionLog;
//# sourceMappingURL=SessionLog.js.map