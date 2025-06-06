import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    username: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}
declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
export default User;
