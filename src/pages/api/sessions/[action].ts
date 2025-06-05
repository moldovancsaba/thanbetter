import type { NextApiResponse } from 'next';
import { SessionService } from '../../../services/sessionService';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import connectToDatabase from '../../../lib/mongodb';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { action } = req.query;
  const userId = req.session?.userId;
  const sessionId = req.session?.sessionId;

  if (!userId || !sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (action) {
      case 'logout':
        if (req.method === 'POST') {
          await SessionService.deactivateSession(sessionId, 'LOGOUT', {
            userAgent: req.headers['user-agent'],
            ip: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress
          });
          return res.status(200).json({ success: true });
        }
        break;

      case 'active':
        if (req.method === 'GET') {
          const sessions = await SessionService.getActiveSessions(userId);
          return res.status(200).json(sessions);
        }
        break;

      case 'logs':
        if (req.method === 'GET') {
          const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 50;
          const logs = await SessionService.getSessionLogs(userId, limit);
          return res.status(200).json(logs);
        }
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Session management error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(handler);

