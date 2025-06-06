import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Application, ApplicationCreateInput } from '../types/application';

const applicationSchema = new mongoose.Schema<Application>({
  name: { type: String, required: true },
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true },
  redirectUrls: [{ type: String }],
  createdAt: { 
    type: String, 
    required: true,
    default: () => new Date().toISOString()
  }
});

const ApplicationModel = mongoose.models.Application || mongoose.model<Application>('Application', applicationSchema);

export class ApplicationService {
  private static instance: ApplicationService;

  private constructor() {}

  static getInstance(): ApplicationService {
    if (!ApplicationService.instance) {
      ApplicationService.instance = new ApplicationService();
    }
    return ApplicationService.instance;
  }

  private generateClientId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private generateClientSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async createApplication(input: ApplicationCreateInput): Promise<Application> {
    const application = new ApplicationModel({
      _id: new ObjectId(),
      name: input.name,
      clientId: this.generateClientId(),
      clientSecret: this.generateClientSecret(),
      redirectUrls: input.redirectUrls,
      createdAt: new Date().toISOString()
    });

    await application.save();
    return application;
  }

  async validateApplication(clientId: string, clientSecret: string): Promise<Application | null> {
    return ApplicationModel.findOne({
      clientId,
      clientSecret
    });
  }

  async getApplicationById(id: ObjectId): Promise<Application | null> {
    return ApplicationModel.findById(id);
  }

  async getApplicationByClientId(clientId: string): Promise<Application | null> {
    return ApplicationModel.findOne({ clientId });
  }

  async validateRedirectUrl(clientId: string, redirectUrl: string): Promise<boolean> {
    const application = await this.getApplicationByClientId(clientId);
    if (!application) return false;
    return application.redirectUrls.includes(redirectUrl);
  }
}

