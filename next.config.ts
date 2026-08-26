import type { NextConfig } from "next";

const turboRequested = process.argv.some((argument) =>
  ["--turbo", "--turbopack"].includes(argument),
);

if (turboRequested) {
  throw new Error(
    "Turbopack est désactivé pour ce projet afin d’éviter les erreurs HMR. Lancez `npm run dev`.",
  );
}

const oneYear = "public, max-age=31536000, immutable";
const oneMonth = "public, max-age=2592000, stale-while-revalidate=86400";
const cdnLong = "public, max-age=31536000, stale-while-revalidate=86400";

const immutableHeaders = [
  { key: "Cache-Control", value: oneYear },
  { key: "CDN-Cache-Control", value: oneYear },
  { key: "Vercel-CDN-Cache-Control", value: oneYear },
];

const staticHeaders = [
  { key: "Cache-Control", value: oneMonth },
  { key: "CDN-Cache-Control", value: cdnLong },
  { key: "Vercel-CDN-Cache-Control", value: cdnLong },
];

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), autoplay=(self)",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com",
      "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net",
      "frame-src https://www.google.com https://maps.google.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 768, 828, 1024, 1080, 1200, 1280, 1536, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bec-rdc.com" }],
        destination: "https://bec-rdc.com/:path*",
        permanent: true,
      },
      { source: "/actualites", destination: "/", permanent: true },
      { source: "/actualites/:path*", destination: "/", permanent: true },
      { source: "/admin/actualites", destination: "/admin", permanent: false },
      { source: "/admin/actualites/:path*", destination: "/admin", permanent: false },
      { source: "/admin/avis", destination: "/admin/messages?onglet=avis", permanent: false },
      { source: "/admin/avis/:path*", destination: "/admin/messages?onglet=avis", permanent: false },
    ];
  },
  async headers() {
    const assets = process.env.NODE_ENV === "production" ? immutableHeaders : [{ key: "Cache-Control", value: "no-store" }];
    const images = process.env.NODE_ENV === "production" ? staticHeaders : [{ key: "Cache-Control", value: "no-store" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/_next/static/:path*", headers: assets },
      { source: "/images/:path*", headers: images },
      { source: "/uploads/:path*", headers: process.env.NODE_ENV === "production" ? immutableHeaders : [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/favicon.png", headers: images },
      { source: "/apple-touch-icon.png", headers: images },
    ];
  },
  serverExternalPackages: ["@prisma/client", "prisma", "sanitize-html"],
  experimental: {
    middlewareClientMaxBodySize: "55mb",
    serverActions: {
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;
