interface ClientApplication {
  clientId: string;
  clientSecret: string;
  name: string;
  redirectUris: string[];
  createdAt: string; // ISO 8601 format with milliseconds: 2025-04-13T12:34:56.789Z
  updatedAt: string; // ISO 8601 format with milliseconds: 2025-04-13T12:34:56.789Z
}

export default ClientApplication;

