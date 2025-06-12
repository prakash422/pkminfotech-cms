/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporarily ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Enable next-gen image formats
    formats: ['image/webp', 'image/avif'],
  },
  // Enable static exports for better performance
  output: 'standalone',
  
  // Comprehensive redirect handling
  async redirects() {
    return [
      // === SPECIFIC BROKEN URLS FROM AHREFS ===
      
      // 404 errors - redirect to appropriate sections
      {
        source: '/tribal-culture-in-india',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/rajasthani-culture',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/discover-akshardham-serene-boat-ride-in-delhi',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/bahubali-hills-udaipur-where-nature-and-history-converge',
        destination: '/latest',
        permanent: true,
      },
      
      // 308 redirects - update to final destinations
      {
        source: '/mi-cloud',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/lugu-pahar-jharkhand',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/bhadrakali_mandir_itkhori',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/bhadrakali-mandir-itkhori',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/best-laptop-under-50000',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/telibagh-lucknow-uttar-pradesh',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/web-series-on-netflix',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/hot-webseries',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/banaso-mandir',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/ranchi-waterpark-discovering-the-aquatic-wonderland',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/sandhya-veer-ranchi-a-beacon-of-progress-and-culture',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/how-to-link-pan-card-with-aadhar-card-link-pan-card-with-aadhar-card',
        destination: '/hindi',
        permanent: true,
      },
      
      // === PREVIOUS REDIRECTS ===
      {
        source: '/diwali2020',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/custom-rom',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/opt-out-of-subsidy-solutions-in-hindi',
        destination: '/hindi',
        permanent: true,
      },
      
      // === PATTERN-BASED REDIRECTS ===
      
      // Web series and entertainment
      {
        source: '/webseries:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/web-series:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/netflix:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/best-web-series:path*',
        destination: '/latest',
        permanent: true,
      },
      
      // Tech and laptop reviews
      {
        source: '/laptop:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/mobile:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/tech-news:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/review:path*',
        destination: '/latest',
        permanent: true,
      },
      
      // Travel and places
      {
        source: '/travel:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/temple:path*',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/mandir:path*',
        destination: '/hindi',
        permanent: true,
      },
      {
        source: '/culture:path*',
        destination: '/latest',
        permanent: true,
      },
      
      // Microsoft related posts → Latest
      {
        source: '/microsoft:path*',
        destination: '/latest',
        permanent: true,
      },
      
      // Any URL with "hindi" → Hindi section
      {
        source: '/:path*hindi:path2*',
        destination: '/hindi',
        permanent: true,
      },
      
      // Any URL with "english" → English section
      {
        source: '/:path*english:path2*',
        destination: '/english',
        permanent: true,
      },
      
      // Cache files and temporary URLs
      {
        source: '/:path*cache:path2*',
        destination: '/latest',
        permanent: true,
      },
      
      // URLs with encoded characters (%)
      {
        source: '/:path*%:path2*',
        destination: '/latest',
        permanent: true,
      },
      
      // === OLD BLOG PATTERNS ===
      
      // Old WordPress/Blogger style URLs
      {
        source: '/p/:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/post/:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/articles/:path*',
        destination: '/latest',
        permanent: true,
      },
      
      // Date-based URLs
      {
        source: '/2020/:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/2021/:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/2022/:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/2023/:path*',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/2024/:path*',
        destination: '/latest',
        permanent: true,
      },
      
      // === CATCH-ALL PATTERNS ===
      
      // Very long URLs (likely broken/spam)
      {
        source: '/:path(.*){100,}',
        destination: '/',
        permanent: true,
      },
      
      // URLs with multiple hyphens (likely broken)
      {
        source: '/:path*---:path2*',
        destination: '/latest',
        permanent: true,
      },
      
      // PHP/ASP extensions
      {
        source: '/:path*.php',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/:path*.asp',
        destination: '/latest',
        permanent: true,
      },
      {
        source: '/:path*.jsp',
        destination: '/latest',
        permanent: true,
      },
      
      // === ADMIN/SYSTEM URLS ===
      {
        source: '/admin:path*',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/wp-admin:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content:path*',
        destination: '/',
        permanent: true,
      },
      
      // === UTILITY REDIRECTS ===
      
      // Pages folder (if migrating from pages router)
      {
        source: '/pages/:path*',
        destination: '/:path*',
        permanent: true,
      },
      
      // API calls to non-existent endpoints
      {
        source: '/api/old:path*',
        destination: '/api',
        permanent: true,
      },
    ]
  },
  
  // Handle rewrites for better URL structure
  async rewrites() {
    return [
      // API routes
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 