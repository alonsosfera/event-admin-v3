/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    // Add canvas to externals
    config.externals = [...config.externals, { canvas: "canvas" }];
    
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable strict mode for CSS
  reactStrictMode: false,
};

export default nextConfig;
