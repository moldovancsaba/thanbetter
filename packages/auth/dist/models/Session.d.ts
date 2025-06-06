import mongoose, { Document } from 'mongoose';
export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    appId: string;
    createdAt: Date;
    expiresAt: Date;
    lastActive: Date;
    isActive: boolean;
}
declare const Session: mongoose.Model<any, {}, {}, {}, any, any>;
export default Session;
export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    appId: string;
    createdAt: Date;
    expiresAt: Date;
    lastActive: Date;
    isActive: boolean;
}
export default Session;
export interface ISession extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    lastActive: Date;
    isActive: boolean;
}
export default Session;
