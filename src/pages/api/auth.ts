import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, addUser } from '../../utils/users';

interface LoginRequest {
  username: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, timestamp } = req.body as LoginRequest;

    // Validate request data
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Invalid username' });
    }

    if (!timestamp || !timestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
      return res.status(400).json({ error: 'Invalid timestamp format. Use ISO 8601 format (e.g., 2025-04-13T12:34:56.789Z)' });
    }

    const users = await getUsers();
    const existingUser = users.find(user => user.username === username);

    // Create or update user with timestamp
    if (!existingUser) {
      await addUser(username, timestamp);
    }

    // Generate session token (in a real app, use a proper session management system)
    const sessionToken = Buffer.from(`${username}-${Date.now()}`).toString('base64');

    res.status(200).json({
      success: true,
      sessionToken,
      loginTime: timestamp
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
