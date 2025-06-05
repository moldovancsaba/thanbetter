export const logger = {
  info: (message: string, data?: unknown) =>
    console.log(`[INFO][${new Date().toISOString()}] ${message}`, data || ''),
  error: (message: string, error?: Error | unknown) =>
    console.error(`[ERROR][${new Date().toISOString()}] ${message}`, error || ''),
  validation: (message: string, data?: unknown) =>
    console.warn(`[VALIDATION][${new Date().toISOString()}] ${message}`, data || '')
};

