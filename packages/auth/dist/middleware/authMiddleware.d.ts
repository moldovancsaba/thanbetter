import { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../models/User';
import { ISession } from '../models/Session';
export interface AuthenticatedRequest extends NextApiRequest {
    user?: IUser;
    session?: ISession;
}
export declare const withAuth: (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => Promise<void>;
