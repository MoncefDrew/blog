/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Avoid webpack vendor-chunk issues with DB packages in dev/SSG workers
  serverExternalPackages: ["drizzle-orm", "@libsql/client"],
  // Reduce build memory usage
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Improve performance
  compress: true,
  // Reduce output size
  productionBrowserSourceMaps: false,
}

export default nextConfig
