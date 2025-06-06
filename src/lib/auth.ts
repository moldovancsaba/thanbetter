import { MongoClient, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

export interface User {
  id: string;
  username: string;
  createdAt: string;
  lastLogin: string;
}

export async function getOrCreateUser(username: string): Promise<User> {
  await client.connect();
  const db = client.db('thanperfect');
  const users = db.collection('users');

  const timestamp = new Date().toISOString();
  const existingUser = await users.findOne({ username });

  if (existingUser) {
    await users.updateOne(
      { _id: existingUser._id },
      { $set: { lastLogin: timestamp } }
    );
    return {
      id: existingUser._id.toString(),
      username: existingUser.username,
      createdAt: existingUser.createdAt,
      lastLogin: timestamp
    };
  }

  const result = await users.insertOne({
    username,
    createdAt: timestamp,
    lastLogin: timestamp
  });

  return {
    id: result.insertedId.toString(),
    username,
    createdAt: timestamp,
    lastLogin: timestamp
  };
}

export async function getAllUsers(): Promise<User[]> {
  await client.connect();
  const db = client.db('thanperfect');
  const users = db.collection('users');

  const userDocs = await users.find().toArray();
  return userDocs.map(doc => ({
    id: doc._id.toString(),
    username: doc.username,
    createdAt: doc.createdAt,
    lastLogin: doc.lastLogin
  }));
}

export async function deleteUser(id: string): Promise<boolean> {
  await client.connect();
  const db = client.db('thanperfect');
  const users = db.collection('users');

  const result = await users.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function updateUsername(id: string, newUsername: string): Promise<User | null> {
  await client.connect();
  const db = client.db('thanperfect');
  const users = db.collection('users');

  const timestamp = new Date().toISOString();
  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { username: newUsername, lastLogin: timestamp } },
    { returnDocument: 'after' }
  );

  if (!result) return null;

  return {
    id: result._id.toString(),
    username: result.username,
    createdAt: result.createdAt,
    lastLogin: result.lastLogin
  };
}

export function generateToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

