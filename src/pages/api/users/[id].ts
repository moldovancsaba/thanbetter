import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { logger } from '../../../utils/logger';
import { validateUsername } from '../../../utils/validation';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'PUT':
        const { username } = req.body;

        if (!username) {
          return res.status(400).json({ error: 'Username is required' });
        }

        const validation = validateUsername(username);
        if (!validation.valid) {
          return res.status(400).json({ error: validation.error });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username, _id: { $ne: id } });
        if (existingUser) {
          return res.status(400).json({ error: 'Username is already taken' });
        }

        const updatedUser = await User.findByIdAndUpdate(
          id,
          { username },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        logger.info(`User ${id} updated successfully`);
        return res.status(200).json(updatedUser);

      case 'DELETE':
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        logger.info(`User ${id} deleted successfully`);
        return res.status(200).json({ message: 'User deleted successfully' });

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    logger.error('Error in user management API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(handler);

