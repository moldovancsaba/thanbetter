import { NextApiRequest, NextApiResponse } from 'next';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
  session?: any;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const sessionService = SessionService.getInstance();
    const session = await sessionService.validateSession(token);

    if (!session) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const userService = UserService.getInstance();
    const user = await userService.getUserById(session.userId);

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Attach user and session to request
    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

