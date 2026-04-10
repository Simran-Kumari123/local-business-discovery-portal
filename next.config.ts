import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // Wikipedia / Wikimedia
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '*.wikipedia.org' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      // Loremflickr (free category images)
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'live.staticflickr.com' },
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      // Nominatim / OSM
      { protocol: 'https', hostname: '*.openstreetmap.org' },
    ],
  },
};

export default nextConfig;
