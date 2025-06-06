import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    lastLoginAt: Date;
}
declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
export default User;
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    lastLoginAt: Date;
}
export default User;
export interface IUser extends mongoose.Document {
    username: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}
export default User;
