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
      // Redirect URL lama layanan ke format tab baru
      {
        source: "/layanan/research",
        destination: "/layanan?tab=legal-opinion",
        permanent: false,
      },
      {
        source: "/layanan/policy-brief",
        destination: "/layanan?tab=legal-drafting",
        permanent: false,
      },
      {
        source: "/layanan/training",
        destination: "/layanan?tab=event",
        permanent: false,
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