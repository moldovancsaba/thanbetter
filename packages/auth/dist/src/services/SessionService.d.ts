import { ObjectId } from 'mongodb';
import { ISession } from '../models/Session';
import { IUser } from '../models/User';
export declare class SessionService {
    private static instance;
    private jwtSecret;
    private constructor();
    static getInstance(): SessionService;
    createSession(user: IUser, appId: string): Promise<ISession>;
    validateSession(token: string): Promise<ISession | null>;
    invalidateSession(token: string): Promise<void>;
    invalidateAllUserSessions(userId: ObjectId): Promise<void>;
}
