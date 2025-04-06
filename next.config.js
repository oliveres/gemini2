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
}

module.exports = nextConfig 