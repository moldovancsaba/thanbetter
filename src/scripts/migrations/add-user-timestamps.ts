import { logger } from '../../utils/logger';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';

async function migrateUserTimestamps() {
  try {
    await connectToDatabase();
    logger.info('Connected to database');

    // Find all users without timestamps
    const users = await User.find({
      $or: [
        { createdAt: { $exists: false } },
        { createdAt: null }
      ]
    });

    logger.info(`Found ${users.length} users to update`);

    // Update each user
    for (const user of users) {
      const now = new Date();
      user.createdAt = now;
      user.lastLoginAt = now;
      await user.save();
      logger.info(`Updated user: ${user.username}`);
    }

    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserTimestamps();

