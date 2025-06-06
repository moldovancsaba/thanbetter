import mongoose from 'mongoose';
export interface ISession extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    lastActive: Date;
    isActive: boolean;
}
declare const Session: mongoose.Model<any, {}, {}, {}, any, any>;
export default Session;
