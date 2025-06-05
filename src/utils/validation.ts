export const USERNAME_MIN_LENGTH = 1;

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username || username.length < USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} character long`
    };
  }
  return { valid: true };
};
