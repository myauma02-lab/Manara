// Key untuk setiap halaman — harus konsisten antara admin dan halaman publik
export const HERO_BG_KEYS = {
  homepage:       "hero_bg_homepage",
  tentang:        "hero_bg_tentang",
  publikasi:      "hero_bg_publikasi",
  pusatInformasi: "hero_bg_pusat_informasi",
  layanan:        "hero_bg_layanan",
  insight:        "hero_bg_insight",
  manapeople:     "hero_bg_manapeople",
  proyek:         "hero_bg_proyek",
} as const;

export type HeroBgKey = keyof typeof HERO_BG_KEYS;

// Label untuk display di admin
export const HERO_BG_LABELS: Record<HeroBgKey, { label: string; path: string; desc: string }> = {
  homepage:       { label: "Homepage",        path: "/",                desc: "Ilustrasi hero section halaman utama" },
  tentang:        { label: "Tentang Manara",  path: "/tentang/manara",  desc: "Ilustrasi hero halaman tentang kami" },
  publikasi:      { label: "Publikasi",       path: "/publikasi",       desc: "Ilustrasi hero hub publikasi" },
  pusatInformasi: { label: "Pusat Informasi", path: "/pusat-informasi", desc: "Ilustrasi hero pusat informasi" },
  layanan:        { label: "Layanan",         path: "/layanan",         desc: "Ilustrasi hero halaman layanan" },
  insight:        { label: "Insight",         path: "/insight",         desc: "Ilustrasi hero newsletter & podcast" },
  manapeople:     { label: "Manapeople",      path: "/manapeople",      desc: "Ilustrasi hero rekrutmen" },
  proyek:         { label: "Proyek",          path: "/proyek",          desc: "Ilustrasi hero halaman proyek" },
};