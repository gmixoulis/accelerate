/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      });
    }
    return config
  },
  matcher: ["/myfiles/:path*"],
  i18n: {
    localeDetection: false,
    locales: ["en-US", "el-GR"],
    defaultLocale: "en-US",
  },
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  ignoreDuringBuilds: true,
  experimental: {
    // Required:
    scrollRestoration: true,
    appDir: true,
    serverActions: true,
    nextScriptWorkers: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.accelerate.unic.ac.cy",
      },
    ],
  },
}

export default nextConfig
