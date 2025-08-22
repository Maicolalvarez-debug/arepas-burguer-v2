
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['images.unsplash.com'] },
  env: {
    NEXT_PUBLIC_WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP || process.env.WHATSAPP_NUMBER || '',
    BASE_URL: process.env.BASE_URL || 'https://arepas-burguer-v2.vercel.app',
  },
};
module.exports = nextConfig;
