import { ObjectId } from 'mongodb';
import { Application, ApplicationCreateInput } from '../types/application';
export declare class ApplicationService {
    private static instance;
    private constructor();
    static getInstance(): ApplicationService;
    private generateClientId;
    private generateClientSecret;
    createApplication(input: ApplicationCreateInput): Promise<Application>;
    validateApplication(clientId: string, clientSecret: string): Promise<Application | null>;
    getApplicationById(id: ObjectId): Promise<Application | null>;
    getApplicationByClientId(clientId: string): Promise<Application | null>;
    validateRedirectUrl(clientId: string, redirectUrl: string): Promise<boolean>;
}
