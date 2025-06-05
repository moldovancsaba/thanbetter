import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const users = await User.find({}).select('_id username createdAt lastLoginAt');
        return res.status(200).json(users);

      case 'PUT':
        const { id, username } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { username },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(updatedUser);

      case 'DELETE':
        const userId = req.query.id as string;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
