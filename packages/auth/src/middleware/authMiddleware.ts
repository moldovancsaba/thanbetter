import { NextApiRequest, NextApiResponse } from 'next';
import { SessionService } from '../services/SessionService';
import { UserService } from '../services/UserService';
import { IUser } from '../models/User';
import { ISession } from '../models/Session';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: IUser;
  session?: ISession;
}

export const withAuth = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const sessionService = SessionService.getInstance();
    const session = await sessionService.validateSession(token);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userService = UserService.getInstance();
    const user = await userService.getUserById(session.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user and session to request
    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

