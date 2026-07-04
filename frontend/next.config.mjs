/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // ─── Tentang ───────────────────────────────────────────
      {
        source: "/tentang",
        destination: "/tentang/manara",
        permanent: true,
      },
      {
        source: "/manifesto",
        destination: "/tentang/manifesto",
        permanent: true,
      },

      // ─── Publikasi ──────────────────────────────────────────
      {
        source: "/artikel",
        destination: "/publikasi/artikel",
        permanent: true,
      },
      {
        source: "/artikel/:slug",
        destination: "/publikasi/artikel/:slug",
        permanent: true,
      },
      {
        source: "/riset",
        destination: "/publikasi/paper",
        permanent: true,
      },
      {
        source: "/riset/:slug",
        destination: "/publikasi/paper/:slug",
        permanent: true,
      },

      // ─── Layanan ────────────────────────────────────────────
      {
        source: "/proyek",
        destination: "/layanan/research",
        permanent: true,
      },
      {
        source: "/proyek/:slug",
        destination: "/layanan/research/:slug",
        permanent: true,
      },
      {
        source: "/media",
        destination: "/layanan/media",
        permanent: true,
      },
      {
        source: "/media/:channel",
        destination: "/layanan/media/:channel",
        permanent: true,
      },

      // ─── Kategori ────────────────────────────────────────────
      {
        source: "/kategori/:slug",
        destination: "/publikasi/artikel",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;