// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: false }, // cambia a true solo si necesitas que no bloquee el build
  eslint: { ignoreDuringBuilds: true } // opcional: evita fallos por lint en Vercel
}
module.exports = nextConfig
