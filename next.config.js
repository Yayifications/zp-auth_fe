/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuraciones básicas de seguridad y rendimiento
  poweredByHeader: false, // Remover header "X-Powered-By: Next.js" por seguridad
  reactStrictMode: true, // Activar modo estricto de React
  
  // Configuraciones de imágenes para el proyecto
  images: {
    domains: [
      'localhost', 
      'zasspass.com', // Dominio de producción futuro
    ],
    formats: ['image/webp', 'image/avif'], // Formatos modernos
  },

  // Headers de seguridad importantes para una app de autenticación
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY' // Prevenir clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevenir MIME sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block' // Protección XSS
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Redirects útiles para la app de auth
  async redirects() {
    return [
      {
        source: '/signin',
        destination: '/login',
        permanent: true
      },
      {
        source: '/signup',
        destination: '/register?tab=user',
        permanent: true
      }
    ]
  },

  // Variables de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'ZassPass Auth',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_USER_APP_URL: process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3002',
    NEXT_PUBLIC_PARTNER_APP_URL: process.env.NEXT_PUBLIC_PARTNER_APP_URL || 'http://localhost:3003',
    NEXT_PUBLIC_LOGIN_URL: process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:3001/login',
  },

  // Configuraciones de TypeScript y ESLint
  typescript: {
    ignoreBuildErrors: false // Fallar build si hay errores de TS
  },

  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'] // Solo revisar carpeta src
  },

  // Configuraciones específicas para producción
  ...(process.env.NODE_ENV === 'production' && {
    trailingSlash: false,
    
    // Configuraciones adicionales de optimización
    compiler: {
      removeConsole: {
        exclude: ['error'] // Remover console.log pero mantener console.error
      }
    }
  })
};

module.exports = nextConfig;
