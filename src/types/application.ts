import { ObjectId } from 'mongodb';

export interface Application {
  _id: ObjectId;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUrls: string[];
  createdAt: string;  // ISO 8601 string
}

export interface ApplicationCreateInput {
  name: string;
  redirectUrls: string[];
}

