/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // Specify the allowed domains as an array
  },
};

module.exports = nextConfig;
