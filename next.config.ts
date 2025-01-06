/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    GOOGLE_APP_API_KEY: process.env.GOOGLE_APP_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: ''
      }
    ]
  }
};

export default nextConfig;