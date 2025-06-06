import { ObjectId } from 'mongodb';
import { IUser } from '../models/User';
import { UserCreateInput, UserLoginInput } from '../types/user';
export declare class UserService {
    private static instance;
    private constructor();
    static getInstance(): UserService;
    createUser(input: UserCreateInput): Promise<IUser>;
    validateUser(input: UserLoginInput): Promise<IUser>;
    getUserById(id: ObjectId): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
}
