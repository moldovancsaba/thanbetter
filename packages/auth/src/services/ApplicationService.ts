import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Application, ApplicationCreateInput } from '../types/application';

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
    const application: Application = {
      _id: new ObjectId(),
      name: input.name,
      clientId: this.generateClientId(),
      clientSecret: this.generateClientSecret(),
      redirectUrls: input.redirectUrls,
      createdAt: new Date()
    };

    const Application = mongoose.model('Application');
    await Application.create(application);
    return application;
  }

  async validateApplication(clientId: string, clientSecret: string): Promise<Application | null> {
    const Application = mongoose.model('Application');
    return Application.findOne({
      clientId,
      clientSecret
    });
  }

  async getApplicationById(id: ObjectId): Promise<Application | null> {
    const Application = mongoose.model('Application');
    return Application.findById(id);
  }

  async getApplicationByClientId(clientId: string): Promise<Application | null> {
    const Application = mongoose.model('Application');
    return Application.findOne({ clientId });
  }

  async validateRedirectUrl(clientId: string, redirectUrl: string): Promise<boolean> {
    const application = await this.getApplicationByClientId(clientId);
    if (!application) return false;
    return application.redirectUrls.includes(redirectUrl);
  }
}

