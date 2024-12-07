/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['10.15.0.23'], // หรือใช้ domain ที่คุณใช้ใน src
    unoptimized: true,
  },
};

export default nextConfig;
