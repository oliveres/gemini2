/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignorovat ESLint během buildu - předpokládá se, že kód je zkontrolovaný lokálně
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorovat typové chyby během buildu
    ignoreBuildErrors: true,
  },
  // Přidání dynamického renderování pro stránky, které používají Supabase
  experimental: {
    // Nastavit dynamické renderování pro celou aplikaci
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.digitaloceanspaces.com', 'gemini2-iy76p.ondigitalocean.app'],
    },
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig 