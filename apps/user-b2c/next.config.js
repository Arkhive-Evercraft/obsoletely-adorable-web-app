/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
        search: '',
      }
    ]
  },
  // Use the environment variables loaded from the root .env file
  // This is handled by Next.js automatically when using a monorepo
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
}
export default nextConfig;
