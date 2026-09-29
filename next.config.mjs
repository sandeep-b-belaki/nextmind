/** @type {import('next').NextConfig} */
const nextConfig = {
  // db.ts reads this at runtime via process.cwd() — file tracing misses it,
  // so serverless functions would 500 with ENOENT without this.
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./docs/schema.postgresql.sql'],
    },
  },
};

export default nextConfig;
