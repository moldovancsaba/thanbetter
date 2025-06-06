import { ObjectId } from 'mongodb';

export interface Application {
  _id: ObjectId;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUrls: string[];
  createdAt: Date;
}

export interface ApplicationCreateInput {
  name: string;
  redirectUrls: string[];
}

