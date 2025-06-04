import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, addUser } from '../../utils/users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;
    const users = await getUsers();
    const existingUser = users.find(user => user.username === username);

    if (!existingUser) {
      await addUser(username);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
