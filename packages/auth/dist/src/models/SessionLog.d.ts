import mongoose from 'mongoose';
export interface ISessionLog extends mongoose.Document {
    sessionId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    eventType: 'LOGIN' | 'LOGOUT' | 'EXPIRED';
    timestamp: Date;
    metadata: {
        userAgent?: string;
        ip?: string;
        reason?: string;
    };
}
declare const SessionLog: mongoose.Model<any, {}, {}, {}, any, any>;
export default SessionLog;
