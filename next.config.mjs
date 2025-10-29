import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {};

// Enable PWA with next-pwa (generates service worker into public/)
export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
