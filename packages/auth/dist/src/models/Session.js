"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
sessionSchema.pre('save', function (next) {
    this.lastActive = new Date();
    next();
});
sessionSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ userId: 1 });
const Session = mongoose_1.default.models.Session || mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
//# sourceMappingURL=Session.js.map