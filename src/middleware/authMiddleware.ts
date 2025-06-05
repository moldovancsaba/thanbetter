import { NextApiRequest, NextApiResponse } from 'next';
import { SessionService } from '../services/sessionService';

export interface AuthenticatedRequest extends NextApiRequest {
  session?: {
    userId: string;
    sessionId: string;
  };
}

type NextApiHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse>;

export function withAuth(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      
      // Validate the session
      const session = await SessionService.validateSession(token);
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      // Add session info to the request
      req.session = {
        userId: session.userId.toString(),
        sessionId: (session as any)._id.toString()
      };

      // Continue to the handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

