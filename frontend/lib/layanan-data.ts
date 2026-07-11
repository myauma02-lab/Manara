// ─── TYPES ──────────────────────────────────────────────────
export interface PricingItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceNote?: string;   // "per dokumen", "estimasi 3-5 jam"
  includes: string[];
  extras?: string[];
  isBestSeller?: boolean;
  ctaLabel: string;
  ctaWhatsapp: string;  // pesan WA yang dikirim saat klik
}

export interface ServiceSubItem {
  name: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  pricing?: PricingItem[];
  items?: ServiceSubItem[];  // untuk accordion list
}

export interface LayananData {
  heroTitleAccent: string;
  id: string;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  accentColor: string;
  overview: string;
  overviewPoints: string[];
  proses: { num: string; title: string; desc: string; duration?: string }[];
  deliverables: { icon: string; title: string; desc: string }[];
  clients: string[];
  whyManara: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  categories: ServiceCategory[];
  status: "active" | "coming_soon";
  comingSoonMessage?: string;
}

// ─── NOMOR WHATSAPP ─────────────────────────────────────────
export const WHATSAPP_NUMBER = "6285748957368"; // Ganti dengan nomor Manara

// ─── DATA LEGAL OPINION ─────────────────────────────────────
export const LEGAL_OPINION_DATA: LayananData = {
  id: "legal-opinion",
  title: "Legal Opinion",
  heroTitle: "Dapatkan Pendapat Hukum",
  heroTitleAccent: "dari Ahli yang Tepercaya.",
  heroSubtitle: "dari Ahli yang Tepercaya.",
  heroDesc: "Legal opinion adalah dokumen hukum berisi opini resmi dari advokat yang digunakan untuk mencegah atau menyelesaikan sengketa hukum.",
  accentColor: "#266c87",
  overview: "Legal Opinion merupakan dokumen hukum yang berisikan opini hukum dari advokat yang digunakan untuk mencegah terjadinya sengketa maupun menyelesaikan sengketa hukum. Legal opinion dapat disajikan secara lisan maupun tertulis untuk orang yang membutuhkan.",
  overviewPoints: [
    "Dibuat dengan Bahasa Indonesia yang jelas dan dapat dipahami",
    "Memperoleh 3x Konsultasi via online selama 30 menit",
    "1x revisi dokumen/kasus hukum tertentu",
    "Dikerjakan oleh advokat berpengalaman",
  ],
  proses: [
    { num: "01", title: "Konsultasi Awal", desc: "Diskusikan kasus atau kebutuhan hukum Anda dengan tim advokat kami secara online.", duration: "30 menit" },
    { num: "02", title: "Analisis Dokumen", desc: "Tim kami menganalisis fakta, dokumen pendukung, dan regulasi yang relevan.", duration: "1–3 hari" },
    { num: "03", title: "Penyusunan Opini", desc: "Advokat menyusun legal opinion yang komprehensif berdasarkan analisis mendalam.", duration: "2–5 hari" },
    { num: "04", title: "Review & Revisi", desc: "Klien mereview dan mengajukan revisi jika diperlukan (1x revisi termasuk).", duration: "1–2 hari" },
    { num: "05", title: "Dokumen Final", desc: "Legal opinion final diserahkan dalam format PDF yang siap digunakan.", duration: "1 hari" },
  ],
  deliverables: [
    { icon: "◇", title: "Dokumen Legal Opinion", desc: "Dokumen resmi berisi opini hukum yang komprehensif dan dapat dipertanggungjawabkan." },
    { icon: "○", title: "3x Sesi Konsultasi", desc: "Tiga sesi konsultasi online masing-masing 30 menit dengan advokat." },
    { icon: "✦", title: "1x Revisi Dokumen", desc: "Satu kali revisi dokumen berdasarkan masukan klien." },
    { icon: "△", title: "Analisis Risiko Hukum", desc: "Identifikasi potensi risiko hukum dari situasi yang dikonsultasikan." },
  ],
  clients: ["Pengusaha & UMKM", "Startup & Perusahaan", "Individu dengan sengketa", "NGO & Organisasi", "Investor"],
  whyManara: [
    { title: "Advokat Berpengalaman", desc: "Legal opinion kami disusun oleh advokat dengan pengalaman lebih dari 5 tahun di bidangnya." },
    { title: "Proses Transparan", desc: "Setiap tahap dikomunikasikan dengan jelas. Klien selalu mengetahui perkembangan dokumennya." },
    { title: "Bahasa yang Dapat Dipahami", desc: "Dokumen hukum yang kami buat menggunakan bahasa yang jelas, bukan jargon teknis yang membingungkan." },
    { title: "Revisi Terjamin", desc: "Kami menjamin satu kali revisi tanpa biaya tambahan untuk memastikan kepuasan klien." },
  ],
  faqs: [
    { q: "Apa beda legal opinion dengan konsultasi hukum biasa?", a: "Konsultasi hukum bersifat informal dan lisan. Legal opinion adalah dokumen resmi tertulis yang dapat digunakan sebagai referensi hukum atau bukti pendukung dalam proses hukum." },
    { q: "Berapa lama pengerjaan legal opinion?", a: "Rata-rata 5–10 hari kerja tergantung kompleksitas kasus. Kasus sederhana bisa lebih cepat." },
    { q: "Apakah legal opinion berlaku di pengadilan?", a: "Legal opinion dapat digunakan sebagai dokumen pendukung. Namun untuk dokumen yang mengikat secara hukum, diperlukan akta notaris atau perjanjian formal." },
    { q: "Bagaimana proses pembayaran?", a: "Pembayaran dilakukan di awal sebelum pengerjaan dimulai. Kami menerima transfer bank dan berbagai metode pembayaran digital." },
  ],
  categories: [
    {
      id: "legal-opinion-standard",
      title: "Legal Opinion",
      pricing: [
        {
          id: "lo-standard",
          name: "Legal Opinion Standard",
          description: "Untuk kebutuhan opini hukum umum dan pencegahan sengketa",
          price: 2500000,
          priceNote: "per dokumen",
          includes: [
            "Dokumen Legal Opinion resmi",
            "3x Konsultasi online (30 mnt)",
            "1x Revisi dokumen",
            "Analisis risiko hukum",
          ],
          isBestSeller: false,
          ctaLabel: "Pesan Sekarang",
          ctaWhatsapp: "Halo Manara, saya ingin memesan layanan Legal Opinion Standard",
        },
      ],
    },
  ],
  status: "active",
};

// ─── DATA LEGAL DRAFTING ─────────────────────────────────────
export const LEGAL_DRAFTING_DATA: LayananData = {
  id: "legal-drafting",
  title: "Legal Drafting",
  heroTitle: "Buat Perjanjian & Kontrak",
  heroTitleAccent: "yang Kuat Secara Hukum.",
  heroSubtitle: "yang Kuat Secara Hukum.",
  heroDesc: "Legal drafting adalah proses penyusunan atau perancangan dokumen hukum secara sistematis dan sesuai kaidah hukum yang berlaku.",
  accentColor: "#3F6F6A",
  overview: "Legal Drafting dibawah tangan adalah penyusunan dokumen perjanjian atau kontrak yang dibuat oleh para pihak secara langsung tanpa keterlibatan notaris. Dokumen ini tetap sah dan mengikat secara hukum apabila dibuat sesuai kaidah yang benar.",
  overviewPoints: [
    "Dokumen dibuat sesuai kaidah hukum yang berlaku di Indonesia",
    "Memiliki kekuatan mengikat yang dapat dipertanggungjawabkan secara hukum",
    "Bahasa yang jelas, tepat, dan mudah dipahami semua pihak",
    "Mengantisipasi potensi sengketa di masa mendatang",
  ],
  proses: [
    { num: "01", title: "Konsultasi Kebutuhan", desc: "Diskusikan jenis perjanjian, pihak-pihak yang terlibat, dan poin-poin penting yang harus tercakup.", duration: "30 menit" },
    { num: "02", title: "Pengumpulan Informasi", desc: "Klien menyerahkan informasi lengkap: identitas para pihak, objek perjanjian, hak dan kewajiban.", duration: "1 hari" },
    { num: "03", title: "Penyusunan Draft", desc: "Tim drafting menyusun dokumen berdasarkan informasi yang diterima dan regulasi yang berlaku.", duration: "1–3 hari" },
    { num: "04", title: "Review Bersama", desc: "Klien mereview draft dan memberikan masukan. Revisi dilakukan sesuai kebutuhan.", duration: "1–2 hari" },
    { num: "05", title: "Dokumen Final", desc: "Perjanjian final diserahkan siap ditandatangani oleh para pihak.", duration: "1 hari" },
  ],
  deliverables: [
    { icon: "◇", title: "Dokumen Perjanjian", desc: "Draft perjanjian yang telah sesuai kaidah hukum, siap ditandatangani." },
    { icon: "✦", title: "1x Revisi", desc: "Satu kali revisi gratis berdasarkan masukan klien." },
    { icon: "○", title: "Konsultasi Pendampingan", desc: "Penjelasan pasal demi pasal atas permintaan klien." },
  ],
  clients: ["UMKM & Wirausahawan", "Freelancer & Profesional", "Perusahaan Startup", "Individu", "Organisasi Non-Profit"],
  whyManara: [
    { title: "Harga Terjangkau", desc: "Legal drafting berkualitas dengan harga yang terjangkau, tanpa biaya tersembunyi." },
    { title: "Turnaround Cepat", desc: "Dokumen selesai dalam 3–5 hari kerja, lebih cepat dari rata-rata firma hukum konvensional." },
    { title: "Berbasis Regulasi Terkini", desc: "Selalu mengacu pada regulasi dan perundang-undangan terbaru yang berlaku di Indonesia." },
    { title: "Konsultasi Inklusif", desc: "Setiap paket sudah termasuk sesi konsultasi untuk memastikan dokumen sesuai kebutuhan." },
  ],
  faqs: [
    { q: "Apa beda perjanjian bawah tangan dengan perjanjian notaris?", a: "Perjanjian bawah tangan tidak melibatkan notaris sehingga lebih terjangkau. Namun tetap sah dan mengikat. Perjanjian notaris memiliki kekuatan pembuktian yang lebih kuat karena dibuat oleh pejabat umum." },
    { q: "Jenis perjanjian apa saja yang bisa dibuat?", a: "Kami dapat membuat berbagai jenis perjanjian: sewa menyewa, jual beli, kerja sama, pinjam pakai, perjanjian kerja, franchise, distribusi, dan lainnya sesuai kebutuhan." },
    { q: "Berapa lama proses pengerjaan?", a: "Rata-rata 3–5 hari kerja. Untuk perjanjian sederhana bisa lebih cepat." },
    { q: "Apakah saya bisa minta template perjanjian yang sudah ada?", a: "Ya, kami memiliki template untuk jenis perjanjian umum yang dapat dikustomisasi sesuai kebutuhan spesifik Anda." },
  ],
  categories: [
    {
      id: "hr-personalia",
      title: "HR / Personalia",
      items: [
        { name: "Perjanjian Kerja Waktu Tidak Tertentu (Permanent Employment Agreement)" },
        { name: "Perjanjian Kerja Waktu Tertentu (Temporary Employment Agreement)" },
        { name: "Perjanjian Kerja Freelance (Freelance Agreement)" },
        { name: "Perjanjian Kepemilikan Saham Karyawan (ESOP Agreement)" },
        { name: "Perjanjian Outsource" },
        { name: "Peraturan Perusahaan (Company Policy)" },
        { name: "Surat PHK" },
        { name: "Surat Peringatan" },
      ],
      pricing: [
        {
          id: "draft-hr",
          name: "Legal Drafting HR / Personalia",
          description: "Semua dokumen ketenagakerjaan untuk perusahaan Anda",
          price: 990000,
          priceNote: "mulai dari / dokumen",
          includes: [
            "Draft dokumen sesuai kebutuhan",
            "Konsultasi ketenagakerjaan",
            "1x Revisi dokumen",
            "File siap tanda tangan",
          ],
          ctaLabel: "Pesan Sekarang",
          ctaWhatsapp: "Halo Manara, saya ingin memesan layanan Legal Drafting HR/Personalia",
        },
      ],
    },
    {
      id: "kerja-sama",
      title: "Kerja Sama",
      items: [
        { name: "Perjanjian Kerja Sama (PKS)" },
        { name: "Memorandum of Understanding (MoU)" },
        { name: "Joint Venture Agreement" },
        { name: "Perjanjian Distribusi" },
        { name: "Perjanjian Kerahasiaan (NDA)" },
      ],
      pricing: [
        {
          id: "draft-kerjasama",
          name: "Legal Drafting Kerja Sama",
          description: "Dokumen kerja sama dan kemitraan bisnis",
          price: 990000,
          priceNote: "mulai dari / dokumen",
          includes: [
            "Draft perjanjian kerja sama",
            "Konsultasi klausul kritis",
            "1x Revisi dokumen",
            "File siap tanda tangan",
          ],
          ctaLabel: "Pesan Sekarang",
          ctaWhatsapp: "Halo Manara, saya ingin memesan layanan Legal Drafting Kerja Sama",
        },
      ],
    },
    {
      id: "teknologi-informasi",
      title: "Teknologi Informasi",
      items: [
        { name: "Perjanjian Lisensi Software" },
        { name: "Terms of Service (ToS)" },
        { name: "Privacy Policy" },
        { name: "Perjanjian SaaS" },
        { name: "Perjanjian Pengembangan Aplikasi" },
        { name: "IP Assignment Agreement" },
      ],
      pricing: [
        {
          id: "draft-ti",
          name: "Legal Drafting Teknologi Informasi",
          description: "Dokumen hukum khusus industri teknologi dan digital",
          price: 2990000,
          priceNote: "mulai dari / dokumen",
          includes: [
            "Draft dokumen sesuai standar TI",
            "Konsultasi IP & data protection",
            "1x Revisi dokumen",
            "File siap implementasi",
          ],
          ctaLabel: "Pesan Sekarang",
          ctaWhatsapp: "Halo Manara, saya ingin memesan layanan Legal Drafting Teknologi Informasi",
        },
      ],
    },
    {
      id: "properti",
      title: "Properti & Bisnis",
      items: [
        { name: "Perjanjian Sewa Menyewa" },
        { name: "Perjanjian Jual Beli" },
        { name: "Perjanjian Pinjam Pakai" },
        { name: "Perjanjian Titipan" },
        { name: "Perjanjian Event (Sponsor)" },
      ],
      pricing: [
        {
          id: "draft-properti",
          name: "Legal Drafting Properti & Bisnis",
          description: "Dokumen properti, jual beli, dan transaksi bisnis",
          price: 990000,
          priceNote: "mulai dari / dokumen",
          includes: [
            "Draft perjanjian properti/bisnis",
            "Verifikasi aspek hukum",
            "1x Revisi dokumen",
            "File siap tanda tangan",
          ],
          ctaLabel: "Pesan Sekarang",
          ctaWhatsapp: "Halo Manara, saya ingin memesan layanan Legal Drafting Properti",
        },
      ],
    },
  ],
  status: "active",
};

// ─── DATA LEGAL REVIEW ─────────────────────────────────────
export const LEGAL_REVIEW_DATA: LayananData = {
  id: "legal-review",
  title: "Legal Review",
  heroTitle: "Review Dokumen Hukum Anda",
  heroTitleAccent: "Review",
  heroSubtitle: "sebelum Tanda Tangan.",
  heroDesc: "Legal review adalah proses pemeriksaan, penelaahan, dan analisis terhadap suatu dokumen hukum untuk memastikan dokumen tersebut valid dan tidak merugikan kepentingan Anda.",
  accentColor: "#5F8F8A",
  overview: "Sebelum menandatangani kontrak atau perjanjian apapun, pastikan dokumen tersebut telah diperiksa oleh ahli hukum. Legal review membantu mengidentifikasi klausul yang berpotensi merugikan, celah hukum, dan ketidaksesuaian dengan regulasi yang berlaku.",
  overviewPoints: [
    "Review dokumen dengan catatan risiko hukum yang komprehensif",
    "Pengerjaan dalam 3–5 jam untuk dokumen standar",
    "File review & final siap pakai dengan Track Changes",
    "Cek bahasa & risiko hukum secara menyeluruh",
    "Revisi gratis untuk klausul yang bermasalah",
  ],
  proses: [
    { num: "01", title: "Upload Dokumen", desc: "Kirimkan dokumen yang ingin direview melalui platform kami secara aman.", duration: "5 menit" },
    { num: "02", title: "Briefing Awal", desc: "Tim kami menghubungi untuk memahami konteks dan fokus area review.", duration: "15–30 menit" },
    { num: "03", title: "Analisis Mendalam", desc: "Advokat menganalisis setiap klausul, mengidentifikasi risiko, dan menyusun catatan.", duration: "2–4 jam" },
    { num: "04", title: "Laporan Review", desc: "Dokumen dikembalikan dengan Track Changes dan laporan risiko hukum.", duration: "1–2 jam" },
    { num: "05", title: "Konsultasi Hasil", desc: "Diskusi bersama untuk menjelaskan temuan dan rekomendasi perubahan.", duration: "30 menit" },
  ],
  deliverables: [
    { icon: "◇", title: "Dokumen Track Changes", desc: "Dokumen asli dengan markup perubahan yang direkomendasikan secara jelas." },
    { icon: "✦", title: "Laporan Risiko Hukum", desc: "Catatan tertulis tentang klausul berisiko, celah hukum, dan rekomendasi perbaikan." },
    { icon: "○", title: "Dokumen Final", desc: "Versi final dokumen setelah perbaikan siap ditandatangani." },
    { icon: "△", title: "Sesi Konsultasi", desc: "Penjelasan langsung hasil review dari advokat yang mengerjakan." },
  ],
  clients: ["Pebisnis yang akan tanda tangan kontrak", "Startup & investor", "Perusahaan yang menerima dokumen dari mitra", "UMKM", "Individu yang terlibat perjanjian besar"],
  whyManara: [
    { title: "Cepat & Efisien", desc: "Review selesai dalam 3–5 jam kerja, tidak perlu menunggu berhari-hari." },
    { title: "Catatan Risiko Terstruktur", desc: "Setiap risiko dicatat dengan jelas beserta rekomendasi mitigasinya." },
    { title: "Track Changes yang Mudah Dipahami", desc: "Perubahan ditandai dengan warna berbeda sehingga mudah dilacak dan dipahami." },
    { title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi. Harga sudah mencakup semua yang tertera dalam paket." },
  ],
  faqs: [
    { q: "Dokumen apa saja yang bisa direview?", a: "Semua jenis dokumen hukum: kontrak bisnis, perjanjian kerja, perjanjian sewa, MoU, term sheet, dan dokumen hukum lainnya." },
    { q: "Berapa lama proses review?", a: "Rata-rata 3–5 jam untuk dokumen standar (10–20 halaman). Dokumen lebih panjang atau kompleks mungkin membutuhkan waktu lebih." },
    { q: "Apakah dokumen saya aman?", a: "Ya. Kami menjaga kerahasiaan dokumen Anda. Seluruh tim menandatangani NDA dan sistem kami menggunakan enkripsi end-to-end." },
    { q: "Bagaimana jika dokumen saya dalam bahasa Inggris?", a: "Kami dapat mereview dokumen dalam bahasa Indonesia maupun Inggris dengan tim yang berpengalaman dalam keduanya." },
  ],
  categories: [
    {
      id: "review-kontrak",
      title: "Jasa Review Kontrak",
      pricing: [
        {
          id: "review-standard",
          name: "Legal Review Standard",
          description: "Untuk kontrak dan perjanjian standar hingga 20 halaman",
          price: 1500000,
          priceNote: "per dokumen · est. 3–5 jam",
          includes: [
            "Review menyeluruh seluruh klausul",
            "Catatan risiko hukum",
            "Dokumen dengan Track Changes",
            "File final siap pakai",
            "Konsultasi hasil review",
          ],
          isBestSeller: true,
          ctaLabel: "Pesan Sekarang",
          ctaWhatsapp: "Halo Manara, saya ingin memesan layanan Legal Review Standard",
        },
        {
          id: "review-complex",
          name: "Legal Review Kompleks",
          description: "Untuk dokumen panjang, multibahasa, atau klausul teknis tinggi",
          price: 3000000,
          priceNote: "per dokumen · est. 1–2 hari",
          includes: [
            "Review mendalam + analisis regulasi",
            "Laporan risiko terstruktur",
            "Dokumen dengan Track Changes",
            "2x sesi konsultasi",
            "1x Revisi pasca-review",
          ],
          ctaLabel: "Konsultasi Dulu",
          ctaWhatsapp: "Halo Manara, saya ingin konsultasi tentang Legal Review Kompleks",
        },
      ],
    },
  ],
  status: "active",
};

// ─── DATA EVENT ─────────────────────────────────────────────
export const EVENT_LAYANAN_DATA: LayananData = {
  id: "event",
  title: "Event",
  heroTitle: "Selenggarakan Event Hukum",
  heroTitleAccent: "yang Bermakna & Berdampak.",
  heroSubtitle: "yang Bermakna & Berdampak.",
  heroDesc: "Manara memfasilitasi berbagai format event hukum dan pendidikan — dari diskusi riset hingga sertifikasi profesional.",
  accentColor: "#8A8F5E",
  overview: "Divisi Event Manara merancang dan menyelenggarakan berbagai program pendidikan hukum dan diskusi publik. Setiap event dirancang untuk meningkatkan literasi hukum masyarakat dan membangun ekosistem pengetahuan yang lebih baik.",
  overviewPoints: [
    "Dirancang oleh tim berpengalaman dengan pemahaman mendalam tentang hukum Indonesia",
    "Format fleksibel: online, offline, atau hybrid sesuai kebutuhan",
    "Narasumber berkualitas dari kalangan akademisi dan praktisi",
    "Dokumentasi lengkap dan materi yang dapat diakses peserta",
  ],
  proses: [
    { num: "01", title: "Konsultasi Event", desc: "Diskusikan tujuan, target peserta, topik, dan format event yang diinginkan.", duration: "1–2 hari" },
    { num: "02", title: "Perencanaan Konten", desc: "Tim kami merancang agenda, kurikulum, dan mempersiapkan narasumber.", duration: "1–2 minggu" },
    { num: "03", title: "Promosi & Registrasi", desc: "Pengelolaan promosi event dan sistem pendaftaran peserta.", duration: "1–2 minggu" },
    { num: "04", title: "Pelaksanaan", desc: "Fasilitasi dan pengelolaan event oleh tim Manara yang berpengalaman.", duration: "Sesuai jadwal" },
    { num: "05", title: "Dokumentasi & Follow-up", desc: "Dokumentasi lengkap, sertifikat peserta, dan laporan pelaksanaan event.", duration: "3–5 hari" },
  ],
  deliverables: [
    { icon: "△", title: "Materi & Modul", desc: "Materi presentasi dan modul yang dapat diakses peserta setelah event." },
    { icon: "◎", title: "Sertifikat Peserta", desc: "Sertifikat kehadiran atau kelulusan untuk setiap peserta." },
    { icon: "◇", title: "Rekaman Event", desc: "Rekaman video untuk event online yang dapat diakses ulang." },
    { icon: "○", title: "Laporan Event", desc: "Laporan pelaksanaan lengkap termasuk notulensi dan evaluasi." },
  ],
  clients: ["Mahasiswa Hukum", "Praktisi & Profesional", "UMKM & Wirausahawan", "NGO & Lembaga", "Instansi Pemerintah"],
  whyManara: [
    { title: "Konten Berkualitas", desc: "Setiap materi dikurasi dan divalidasi oleh tim hukum Manara." },
    { title: "Narasumber Terpilih", desc: "Kami menghadirkan akademisi dan praktisi yang relevan dan berpengalaman." },
    { title: "Fleksibel & Customizable", desc: "Format, topik, dan jadwal dapat disesuaikan dengan kebutuhan klien." },
    { title: "Dokumentasi Profesional", desc: "Setiap event didokumentasikan secara profesional untuk kebutuhan arsip dan promosi." },
  ],
  faqs: [
    { q: "Format event apa saja yang tersedia?", a: "Kami melayani Diskusi/Research, Webinar, Seminar, Workshop/Pelatihan, dan program Sertifikasi." },
    { q: "Berapa peserta minimum untuk menyelenggarakan event?", a: "Tidak ada minimum khusus. Untuk webinar dan workshop, kami rekomendasikan minimal 20 peserta agar biaya lebih efisien." },
    { q: "Apakah bisa dilakukan di luar kota?", a: "Ya, kami melayani event di seluruh Indonesia. Biaya perjalanan akan disesuaikan." },
    { q: "Apakah sertifikat event diakui secara resmi?", a: "Sertifikat kami dapat diakui tergantung pada jenis event. Untuk program sertifikasi profesional, kami bekerja sama dengan lembaga yang terakreditasi." },
  ],
  categories: [
    {
      id: "event-types",
      title: "Jenis Event",
      pricing: [
        {
          id: "diskusi-research",
          name: "Diskusi & Research",
          description: "Forum diskusi ilmiah dan penelitian bersama",
          price: 0,
          priceNote: "Hubungi kami untuk penawaran",
          includes: [
            "Fasilitasi diskusi terstruktur",
            "Narasumber ahli",
            "Notulensi & dokumentasi",
            "Materi peserta",
          ],
          ctaLabel: "Konsultasi Event",
          ctaWhatsapp: "Halo Manara, saya ingin menyelenggarakan Diskusi/Research",
        },
        {
          id: "webinar-seminar",
          name: "Webinar & Seminar",
          description: "Edukasi hukum online maupun tatap muka",
          price: 0,
          priceNote: "Hubungi kami untuk penawaran",
          includes: [
            "Setup platform online/venue",
            "Narasumber terpilih",
            "Rekaman event (webinar)",
            "Sertifikat peserta",
            "Materi & slide presentasi",
          ],
          isBestSeller: true,
          ctaLabel: "Konsultasi Event",
          ctaWhatsapp: "Halo Manara, saya ingin menyelenggarakan Webinar/Seminar",
        },
        {
          id: "workshop",
          name: "Workshop & Pelatihan",
          description: "Pelatihan intensif dengan praktik langsung",
          price: 0,
          priceNote: "Hubungi kami untuk penawaran",
          includes: [
            "Kurikulum yang terstruktur",
            "Modul pelatihan",
            "Sesi praktik langsung",
            "Sertifikat kelulusan",
            "Akses materi pasca workshop",
          ],
          ctaLabel: "Konsultasi Event",
          ctaWhatsapp: "Halo Manara, saya ingin menyelenggarakan Workshop/Pelatihan",
        },
        {
          id: "sertifikasi",
          name: "Sertifikasi",
          description: "Program sertifikasi profesional di bidang hukum",
          price: 0,
          priceNote: "Hubungi kami untuk penawaran",
          includes: [
            "Program terstruktur multi-sesi",
            "Assessment & evaluasi",
            "Sertifikat resmi",
            "Kerjasama lembaga akreditasi",
          ],
          ctaLabel: "Konsultasi Event",
          ctaWhatsapp: "Halo Manara, saya ingin info program Sertifikasi",
        },
      ],
    },
  ],
  status: "active",
};

// ─── DATA COMING SOON ────────────────────────────────────────
export const CONSULTING_DATA_LAYANAN: LayananData = {
  id: "consulting",
  title: "Consulting",
  heroTitle: "Konsultasi Hukum Strategis",
  heroTitleAccent: "untuk Bisnis Anda.",
  heroSubtitle: "untuk Bisnis Anda.",
  heroDesc: "Layanan konsultasi hukum mendalam untuk kebutuhan strategis perusahaan, dari due diligence hingga restrukturisasi.",
  accentColor: "#266c87",
  overview: "",
  overviewPoints: [],
  proses: [],
  deliverables: [],
  clients: [],
  whyManara: [],
  faqs: [],
  categories: [],
  status: "coming_soon",
  comingSoonMessage: "Kami sedang mempersiapkan layanan Consulting yang lebih komprehensif. Segera hadir!",
};

export const PENDAFTARAN_HUKUM_DATA: LayananData = {
  id: "pendaftaran-hukum",
  title: "Pendaftaran Hukum",
  heroTitle: "Urus Pendaftaran Hukum",
  heroTitleAccent: "Bisnis Anda dengan Mudah.",
  heroSubtitle: "Bisnis Anda dengan Mudah.",
  heroDesc: "Layanan pendirian badan usaha, pendaftaran merek, dan pengurusan perizinan untuk UMKM dan perusahaan.",
  accentColor: "#C6AD8A",
  overview: "",
  overviewPoints: [],
  proses: [],
  deliverables: [],
  clients: [],
  whyManara: [],
  faqs: [],
  categories: [],
  status: "coming_soon",
  comingSoonMessage: "Layanan pendaftaran hukum sedang dalam pengembangan. Daftarkan minat Anda dan kami akan menghubungi Anda segera!",
};

// ─── SEMUA LAYANAN ───────────────────────────────────────────
export const ALL_LAYANAN: LayananData[] = [
  LEGAL_OPINION_DATA,
  LEGAL_DRAFTING_DATA,
  LEGAL_REVIEW_DATA,
  EVENT_LAYANAN_DATA,
  CONSULTING_DATA_LAYANAN,
  PENDAFTARAN_HUKUM_DATA,
];