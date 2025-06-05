import mongoose from 'mongoose';
import { logger } from '../utils/logger';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

type GlobalWithMongoose = typeof globalThis & {
  mongoose?: MongooseCache;
};

let cached: MongooseCache = { conn: null, promise: null };
const globalWithMongoose = global as GlobalWithMongoose;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function connectToDatabase() {
  try {
    if (cached.conn) {
      logger.info('Using existing database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      logger.info('Establishing new database connection...');
      const opts = {
        bufferCommands: true,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;

      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.info('MongoDB disconnected');
      });

      return cached.conn;
    } catch (e) {
      cached.promise = null;
      logger.error('Failed to connect to MongoDB:', e);
      throw e;
    }
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;
