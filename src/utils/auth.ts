import { logger } from './logger';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    logger.error('No auth token available');
    return null;
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

