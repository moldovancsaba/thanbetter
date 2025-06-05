import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';
import { SessionService } from '../../services/sessionService';

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
  await connectToDatabase();

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    console.log('Login attempt:', { username, timestamp });

    // Validate request data
    if (!username || typeof username !== 'string') {
      console.log('Invalid username:', username);
      return res.status(400).json({ error: 'Invalid username' });
    }

    // Add username pattern validation
    if (!username.match(USERNAME_PATTERN)) {
      console.log('Username pattern mismatch:', username);
      return res.status(400).json({ 
        error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens' 
      });
    }

    // Validate timestamp
    if (!timestamp) {
      console.log('Missing timestamp');
      return res.status(400).json({ error: 'Timestamp is required' });
    }

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (e) {
      console.log('Invalid timestamp format:', timestamp);
      return res.status(400).json({ 
        error: 'Invalid timestamp format. Use ISO 8601 format (e.g., 2025-04-13T12:34:56.789Z)' 
      });
    }

    try {
      // Find or create user
      let user = await User.findOne({ username: username.toLowerCase() });
      
      if (!user) {
        user = await User.create({
          username: username.toLowerCase(),
          registrationTime: new Date(timestamp),
          lastActive: new Date()
        });
      }

      // Create a new session
      const session = await SessionService.createSession(user._id.toString(), {
        userAgent: req.headers['user-agent'],
        ip: ip.toString()
      });

      res.status(200).json({
        success: true,
        sessionToken: session.token,
        userId: user._id,
        username: user.username,
        loginTime: timestamp
      });
    } catch (e) {
      console.error('User/Session management error:', e);
      return res.status(500).json({ error: 'Failed to manage user data' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
