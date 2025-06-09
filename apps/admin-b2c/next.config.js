/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use the environment variables loaded from the root .env file
  // This is handled by Next.js automatically when using a monorepo
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
};

export default nextConfig;
