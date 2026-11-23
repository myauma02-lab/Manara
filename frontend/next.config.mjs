/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },

  async redirects() {
    return [
      { source: "/admin/artikel/new", destination: "/admin/publikasi/new?format=PERSPECTIVE", permanent: false },
      { source: "/admin/artikel/:id", destination: "/admin/publikasi/:id", permanent: false },
      { source: "/admin/artikel", destination: "/admin/publikasi", permanent: false },
      { source: "/dashboard/publikasi/artikel/new", destination: "/dashboard/publikasi/new?format=PERSPECTIVE", permanent: false },
      { source: "/dashboard/publikasi/artikel/:id", destination: "/dashboard/publikasi/:id", permanent: false },
      { source: "/dashboard/publikasi/artikel", destination: "/dashboard/publikasi", permanent: false },
      { source: "/dashboard/publikasi/paper/new", destination: "/dashboard/publikasi/new?format=RESEARCH_PAPER", permanent: false },
      { source: "/dashboard/publikasi/paper/:id", destination: "/dashboard/publikasi/:id", permanent: false },
      { source: "/dashboard/publikasi/paper", destination: "/dashboard/publikasi", permanent: false },
      { source: "/dashboard/publikasi/jurnal/:path*", destination: "/dashboard/publikasi", permanent: false },
      { source: "/admin/project/:path*", destination: "/admin", permanent: false },
      { source: "/dashboard/ops/proyek/:path*", destination: "/dashboard/ops", permanent: false },
      { source: "/proyek/:path*", destination: "/publikasi", permanent: false },
      { source: "/layanan/research/projects/:path*", destination: "/publikasi", permanent: false },
      { source: "/layanan/research/:slug", destination: "/publikasi", permanent: false },
      { source: "/insight/:path*", destination: "/pusat-informasi", permanent: false },
      { source: "/pusat-informasi/agenda/:path*", destination: "/pusat-informasi", permanent: false },
      { source: "/pusat-informasi/magazine/:path*", destination: "/pusat-informasi", permanent: false },
    ];
  },
};

export default nextConfig;
