/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  env: {
    supabaseUrl: process.env.SUPABASEURL || "",
    supabaseAnonKey: process.env.SUPABASEANONKEY || "",
  },
};

export default nextConfig;
