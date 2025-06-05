import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';
import { SessionService } from '../../services/sessionService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectToDatabase();

  const { username } = req.body;
  const timestamp = new Date().toISOString();

  try {
    let user = await User.findOne({ username });
    
    if (!user) {
      user = await User.create({ username });
    }

    const session = await SessionService.createSession(user._id.toString(), {});

    res.status(200).json({
      success: true,
      sessionToken: session.token,
      userId: user._id,
      username: user.username,
      loginTime: timestamp
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
