import { ObjectId } from 'mongodb';

export interface Session {
  _id: ObjectId;
  userId: ObjectId;
  token: string;
  appId: string;
  createdAt: Date; // ISO 8601 format
  expiresAt: Date; // ISO 8601 format
}

