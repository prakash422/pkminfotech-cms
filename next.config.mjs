/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Enable React 18 features
    appDir: true,
    
    // Optimize CSS
    optimizeCss: true,
    
    // Enable SWC minifier for faster builds
    swcMinify: true,
  },

  // Image optimization
  images: {
    // Enable built-in image optimization
    domains: [
      'localhost',
      'pkminfotech.com',
      'www.pkminfotech.com',
      // Add external image domains as needed
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    
    // Image formats to support
    formats: ['image/webp', 'image/avif'],
    
    // Image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Enable placeholder blur
    placeholder: 'blur',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDiQ2sBPlLmQ/hT8+g+9f/2Q=='
  },

  // Compression
  compress: true,

  // PWA and performance headers
  async headers() {
    return [
      {
        // Caching strategy for static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Security headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        // Performance headers for HTML pages
        source: '/((?!api|_next/static|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      }
    ]
  },

  // Redirects for clean URLs and SEO
  async redirects() {
    return [
      // Redirect blog URLs to clean URLs
      {
        source: '/blog/:slug*',
        destination: '/:slug*',
        permanent: true
      },
      // Redirect trailing slashes
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true
      }
    ]
  },

  // Bundle analyzer (enable when needed)
  // analyzer: {
  //   enabled: process.env.ANALYZE === 'true'
  // },

  // Output settings for better performance
  output: 'standalone',

  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: false,

  // Optimize JavaScript bundles
  swcMinify: true,

  // Enable gzip compression
  compress: true,

  // Optimize for Vercel deployment
  eslint: {
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Performance optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Library chunk
          lib: {
            test(module) {
              return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
            },
            name: 'lib',
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Commons chunk
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig; 