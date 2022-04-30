/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  publicRuntimeConfig: {
    API_URL: 'http://localhost:1337/api',
    REACT_APP_URL: 'http://localhost:3005/',
  },
}

module.exports = nextConfig
