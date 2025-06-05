import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, addUser } from '../../utils/users';

// Constants for validation and rate limiting
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,20}$/;
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; firstAttempt: number }>();

interface LoginRequest {
  username: string;
  timestamp: string;
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit) {
    rateLimit.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - userLimit.firstAttempt > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (userLimit.count >= MAX_ATTEMPTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip.toString())) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    const { username, timestamp } = req.body as LoginRequest;

    // Validate request data
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Invalid username' });
    }

    // Add username pattern validation
    if (!username.match(USERNAME_PATTERN)) {
      return res.status(400).json({ 
        error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens' 
      });
    }

    if (!timestamp || !timestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
      return res.status(400).json({ error: 'Invalid timestamp format. Use ISO 8601 format (e.g., 2025-04-13T12:34:56.789Z)' });
    }

    const users = await getUsers();
    const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());

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
