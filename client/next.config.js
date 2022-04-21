/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  publicRuntimeConfig: {
    API_URL: 'http://localhost:1337/api',
  },
}

module.exports = nextConfig
