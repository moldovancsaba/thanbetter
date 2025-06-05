# Environment Setup

Last Updated: 2025-06-05T17:22:37.000Z

## Required Environment Variables

The following environment variables must be set in the Vercel dashboard:

### MONGODB_URI
- Pattern: `mongodb+srv://<username>:<password>@<cluster>/<database>?<options>`
- Set this in Vercel dashboard only, never commit actual credentials

### SESSION_SECRET
- A secure random string for session encryption
- Generate using a secure method
- Set this in Vercel dashboard only

### SESSION_EXPIRY
- Time in milliseconds for session expiration
- Default: 86400000 (24 hours)

## Setting Up Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each required variable
5. Make sure to add them to all environments (Production, Preview, Development)

## Local Development

For local development:
1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. Never commit `.env.local`

## Security Notes

- Never commit actual credentials to version control
- Use placeholder values in example files
- Use Vercel's environment variable encryption
- Rotate secrets regularly

