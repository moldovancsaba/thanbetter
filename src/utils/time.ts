/**
 * Validates if a string is a valid ISO 8601 timestamp
 * @param timestamp - The timestamp string to validate
 * @returns Object containing validation result and optional error message
 */
export function validateTimestamp(timestamp: string): { valid: boolean; error?: string } {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return { 
        valid: false, 
        error: 'Invalid timestamp format. Use ISO 8601 format (e.g., 2025-04-13T12:34:56.789Z)' 
      };
    }
    return { valid: true };
  } catch (e) {
    return { 
      valid: false, 
      error: 'Failed to parse timestamp. Use ISO 8601 format (e.g., 2025-04-13T12:34:56.789Z)' 
    };
  }
}

/**
 * Generates a current timestamp in ISO 8601 format
 * @returns Current timestamp string in ISO 8601 format with milliseconds
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

