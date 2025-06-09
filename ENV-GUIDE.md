# Environment Variables Guide

This project uses a centralized environment variables approach through the `@repo/env` package.

## Setup

1. Create a single `.env` or `.env.local` file in the root of the project
2. Add all required environment variables as listed below
3. The applications will automatically use these variables

## Required Environment Variables

### Database
- `DATABASE_URL`: Connection string for your database

### Authentication
- `PASSWORD`: Admin password for the admin interface
- `JWT_SECRET`: Secret for JWT token generation
- `NEXTAUTH_SECRET`: Secret for NextAuth
- `NEXTAUTH_URL`: URL for NextAuth (e.g., http://localhost:3002)
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_SECRET`: GitHub OAuth client secret

### Payment Processing
- `DEV_SQUARE_ID`: Square API app ID
- `DEV_SQUARE_TOKEN`: Square API token

## How It Works

The project uses `@t3-oss/env-nextjs` for environment variable validation:

- Admin app uses `@repo/env/admin` for its specific variables
- User app uses `@repo/env/web` for its specific variables

Each app will only use the variables it needs from the centralized `.env` file.

## Adding New Environment Variables

1. Define the variable in the root `.env` file
2. Add it to the appropriate schema in either:
   - `packages/env/admin.ts` for admin-only variables
   - `packages/env/web.ts` for user-app variables
   - Both files if shared between apps

Example:
```typescript
// In packages/env/admin.ts
server: {
  EXISTING_VAR: z.string(),
  NEW_VARIABLE: z.string(), // Add your new variable here
},

// Then in runtimeEnv:
runtimeEnv: {
  EXISTING_VAR: process.env.EXISTING_VAR,
  NEW_VARIABLE: process.env.NEW_VARIABLE, // Add it here too
},
```
