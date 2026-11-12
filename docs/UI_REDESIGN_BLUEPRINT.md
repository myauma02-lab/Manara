# Blueprint Redesain UI Manara

**Status:** acuan implementasi; tahap fondasi dan beranda sedang dikerjakan  
**Tanggal:** 12 November 2026  
**Arah:** think tank yang kredibel, mudah dijelajahi, dan akrab bagi generasi muda

## 1. Ringkasan arah

Manara perlu terasa sebagai lembaga riset yang punya kedalaman dan sudut pandang, tetapi tetap mudah dipahami dan digunakan oleh pembaca baru. Pengalaman publik menggabungkan penyajian editorial CELIOS dengan struktur informasi riset CSIS, lalu memakai identitas, topik, konten, dan kebutuhan Manara sendiri.

- **CELIOS sebagai inspirasi penyajian:** narasi utama yang tegas, konten unggulan yang terkurasi, fokus kajian yang mudah ditemukan, serta jalur dari riset menuju dampak.
- **CSIS sebagai inspirasi arsitektur informasi:** publikasi yang dikelompokkan, taksonomi topik, profil ahli, acara, proyek, dan perangkat interaktif.
- **Manara sebagai identitas:** lembaga berbasis Jawa Timur dengan lima topik riset, produk publikasi dan proyek yang sudah ada, serta CMS internal yang dipakai beberapa peran.

Referensi: [CELIOS](https://celios.co.id/) · [CSIS Indonesia](https://www.csis.or.id/)

## 2. Prinsip desain

1. **Jelas sebelum dekoratif.** Pengunjung paham Manara, fokusnya, dan langkah berikutnya sejak bagian awal beranda.
2. **Mudah dipindai.** Judul, ringkasan, label topik, jenis konten, tanggal, penulis, dan aksi utama mempunyai hierarki yang konsisten.
3. **Bahasa lugas dan setara.** Istilah kebijakan dijelaskan dengan ringkasan yang ramah pembaca umum tanpa mengurangi ketelitian riset.
4. **Mobile sebagai pengalaman utama.** Menu, pencarian, filter, formulir, tabel, dan tombol nyaman dipakai dengan jempol serta tidak memerlukan hover.
5. **Interaksi bermakna.** Animasi seperlunya, status sistem jelas, tautan dapat dibagikan, dan navigasi tetap bisa dipakai dengan keyboard.
6. **Konsisten lintas area.** Situs publik, portal, dan CMS memakai bahasa visual yang sama; kebutuhan kerja internal tetap punya pola navigasi yang sesuai peran.

## 3. Peta pengalaman dan halaman

### A. Situs publik

| Area | Halaman/route yang sudah ada | Tujuan pengalaman |
|---|---|---|
| Beranda | `/` | Menjelaskan posisi Manara, menampilkan riset dan publikasi pilihan, mengenalkan lima topik, menunjukkan proyek/dampak, lalu memberi aksi yang jelas. |
| Jelajah publikasi | `/publikasi`, `/publikasi/artikel`, `/publikasi/paper`, `/publikasi/journal` | Membantu pembaca menemukan tulisan berdasarkan kata kunci, jenis publikasi, topik, tahun, dan urutan. |
| Detail publikasi | `/publikasi/artikel/[slug]`, `/publikasi/paper/[slug]`, `/publikasi/journal/[slug]` | Memberi pengalaman baca yang nyaman, metadata lengkap, unduh/bagikan, kode publikasi, dan URL kanonis. |
| Tautan pendek publikasi | `/P/[code]` | Mengarahkan kode publikasi yang sah ke URL kanonis yang berbasis slug. |
| Topik dan riset | Topik melalui filter publikasi; halaman riset/layanan yang sudah ada | Menghubungkan topik dengan karya, proyek, peneliti, dan konteksnya. Hindari membuat halaman tipis tanpa konten yang mendukung. |
| Organisasi | `/tentang/*`, `/manapeople` | Menerangkan misi, manifesto, founder, fellows, dan cara bergabung secara ringkas dan manusiawi. |
| Proyek dan layanan | `/proyek/*`, `/layanan/*` | Menjelaskan masalah, pendekatan, hasil, status, serta cara berkolaborasi. |
| Informasi dan insight | `/pusat-informasi/*`, `/insight/*` | Memisahkan berita, agenda, newsletter, podcast, dan konten berkala dengan label yang mudah dimengerti. |
| Pencarian dan akun | `/cari`, `/portal`, `/login` | Memudahkan pencarian lintas konten dan memberi satu pintu masuk yang jelas untuk pengguna internal. |

### B. Portal dan CMS

| Area kerja | Route yang sudah ada | Arah pengalaman |
|---|---|---|
| Admin/sekretariat | `/admin/*` | Ringkasan kerja, konten, pengaturan, pengguna, pesan, dan media dengan navigasi yang lebih ringkas. |
| Publikasi | `/dashboard/publikasi/*` | Alur naskah, status editorial, kode publikasi, topik, metadata, review, dan penerbitan yang terlihat jelas. |
| Sumber daya manusia | `/dashboard/hr/*` | Daftar kandidat/anggota dan tahapan rekrutmen yang mudah dilacak. |
| Keuangan | `/dashboard/finance/*` | Ringkasan, pemasukan, pengeluaran, anggaran, dan laporan dengan angka serta status yang mudah dibaca. |
| Operasional | `/dashboard/ops/*` | Layanan, proyek, vendor, dan konten operasional dalam pola pengelolaan yang seragam. |

Portal tetap menjadi pintu masuk tunggal. Hak akses dan pengalihan berdasarkan peran dipertahankan.

## 4. Navigasi yang diusulkan

Top-level publik dibuat ringkas dan berbasis tugas:

1. **Publikasi** — semua artikel, paper, dan journal.
2. **Topik Riset** — lima topik Manara; tiap pilihan membuka publikasi terkait.
3. **Program** — proyek dan layanan.
4. **Wawasan** — berita, agenda, newsletter, podcast, dan insight.
5. **Tentang** — Manara, manifesto, founder, fellows, dan ManaPeople.
6. **Cari** dan tombol **Portal** sebagai aksi yang mudah dikenali.

Nama menu dan pengelompokan final ditetapkan saat implementasi setelah dicocokkan dengan label yang sudah digunakan pembaca. Di layar kecil, gunakan panel navigasi yang mudah ditutup, dengan pencarian dan Portal tetap mudah dijangkau.

## 5. Sistem visual awal

Ini baseline yang menjaga pengenalan merek Manara; nilainya dapat disempurnakan pada tahap komponen.

| Token | Nilai awal | Pemakaian |
|---|---|---|
| Ink / navy | `#0F2830` | Teks utama, header gelap, navigasi internal. |
| Ocean | `#266C87` | Aksi utama, tautan, indikator aktif. |
| Sage | `#86AFAA` | Aksen, status pendukung, highlight. |
| Ivory | `#F4F7F7` | Latar halaman publik. |
| White | `#FFFFFF` | Kartu dan panel. |
| Text | `#1C3038` | Teks utama pada latar terang. |

- Gunakan DM Sans untuk antarmuka dan teks isi; gunakan Newsreader untuk judul editorial. Cormorant dipertahankan hanya jika punya fungsi ekspresif yang konsisten.
- Samakan lebar konten, skala jarak, bentuk tombol/kartu, garis batas, fokus keyboard, dan status hover/focus/disabled.
- Jaga kontras teks dan kontrol, ukuran sentuh minimum sekitar 44 px, serta dukung `prefers-reduced-motion`.
- Pakai gambar riset/proyek/orang yang sudah sah dan relevan; jangan mengandalkan gradient sebagai pengganti visual konten di seluruh halaman.

## 6. Pola konten dan komponen

### Kartu publikasi

Tampilkan judul, ringkasan pendek, jenis publikasi, topik, tanggal, penulis, estimasi waktu baca atau unduhan, dan kode publikasi bila tersedia. Seluruh kartu mengikuti satu pola desktop dan mobile.

### Halaman detail publikasi

Urutan yang disarankan: breadcrumb → jenis/topik/tanggal → judul dan ringkasan → penulis → isi → kode dan tombol salin tautan → unduhan/rujukan → tulisan terkait. Slug tetap menjadi URL kanonis; `/P/[code]` tetap menjadi pengalihan.

### Status dan keadaan sistem

Setiap modul memiliki keadaan loading, kosong, berhasil, gagal, dan tanpa akses yang konsisten. Salinan pesannya spesifik dan memberi langkah berikutnya.

### CMS

Formulir dikelompokkan menurut tugas, bukan semua field ditumpuk sekaligus. Status draft/review/published, kesalahan validasi, penyimpanan, dan tindakan berisiko diberi umpan balik yang jelas. Tampilan kode publikasi menjadi baca-saja setelah terbit.

## 7. Temuan audit awal dari source code

- Aplikasi memakai Next.js App Router. Beranda sudah tersusun dari komponen hero, publikasi, riset, proyek, founder, newsletter, dan kontak.
- Halaman publikasi sudah memiliki pencarian, filter jenis dan lima topik, serta filter yang tersimpan di URL. Ini menjadi fondasi kuat untuk pengalaman eksplorasi yang lebih baik.
- Token warna dan font Manara sudah ada di `frontend/app/globals.css` dan layout; halaman publikasi memiliki token CSS sendiri. Keduanya perlu disatukan agar perubahan merek tidak menyebar ke banyak tempat.
- Banyak komponen publik dan dashboard masih memakai inline style; beberapa role dashboard menggandakan shell navigasi dengan palet berbeda. Prioritas teknisnya adalah komponen/tokens bersama, bukan mengubah API atau data.
- `frontend/app/layout.tsx` membungkus seluruh route dengan `HeroBackground` yang mengambil gambar hero beranda; sementara `PageHeroBackground` di `frontend/app/page.tsx` tidak digunakan dan berisi placeholder. Perilaku ini perlu ditata ulang dengan hati-hati agar latar per halaman dan pengaturan CMS tetap berfungsi.
- Layout auth, portal, peran, dan route publikasi sudah tersedia. Redesign akan menyentuh presentasi dan alur visual; aturan autentikasi dan rute data tetap dijaga.

**Batas audit saat ini:** situs live Manara tidak berhasil diambil oleh alat penjelajahan pada sesi ini. Peta di atas berdasarkan source code checkout; perbedaan antara source dan tampilan production perlu dicocokkan saat akses live tersedia.

## 8. Urutan implementasi

### Tahap 1 — Fondasi visual dan shell

- Konsolidasikan token warna, tipografi, container, jarak, fokus, dan breakpoint.
- Bangun pola tombol, label, input, kartu, badge, breadcrumbs, dan keadaan kosong/loading.
- Rapikan shell publik: navbar, menu mobile, pencarian, footer, dan latar per route.

### Tahap 2 — Beranda dan penemuan riset

- Susun hero dengan proposisi Manara, aksi baca/kolaborasi, dan visual yang relevan.
- Tampilkan lima topik riset sebagai jalur penjelajahan utama.
- Prioritaskan karya terbaru, proyek/hasil, orang, newsletter, dan statistik yang bersumber dari data.

### Tahap 3 — Publikasi dan halaman detail

- Satukan tampilan daftar artikel, paper, journal, kartu, pencarian, filter, dan empty state.
- Benahi tipografi baca, metadata, salin tautan, unduhan, kode permanen, dan tulisan terkait.
- Pertahankan canonical, sitemap, kode publikasi, dan redirect `/P/[code]`.

### Tahap 4 — Halaman organisasi, program, dan informasi

- Terapkan komponen bersama ke tentang, fellows, proyek, layanan, berita, agenda, dan insight.
- Rapikan navigasi lintas halaman dan ajakan bertindak.

### Tahap 5 — Portal, dashboard, dan CMS

- Satukan shell dashboard dan pola form/tabel/status.
- Tetap tampilkan menu sesuai peran, tanpa mengubah pemeriksaan hak akses.
- Pastikan alur publikasi editor, writer, dan reviewer tetap mudah dipahami di ponsel.

### Tahap 6 — Validasi

- Jalankan `npm run build` sesuai preferensi proyek; tidak menjalankan server development lokal.
- Tinjau route utama di desktop dan mobile, termasuk layar kosong, error, portal, serta dashboard.
- Periksa kembali tautan, state, akses keyboard, overflow horizontal, dan metadata/canonical.

## 9. Batas perubahan

- Tidak mengubah skema/database, API, isi publikasi, kredensial, atau sistem autentikasi sebagai bagian redesign visual.
- Tidak menghapus route yang sudah digunakan; perubahan navigasi menunjuk ke route yang ada.
- Tidak mengubah permalink publikasi maupun kontrak URL short code.
- Tidak menambah dependensi UI baru sebelum kebutuhan teknisnya terbukti.
- Perubahan dilakukan per tahap agar build dan alur produksi tetap dapat ditinjau.

## 10. Kriteria selesai

- Pengunjung baru dapat memahami Manara dan menemukan topik/publikasi utama tanpa kebingungan.
- Navigasi dan konten nyaman di ponsel tanpa scroll horizontal yang tidak disengaja.
- Situs publik, portal, dan dashboard memakai sistem visual yang konsisten.
- Fungsi pencarian, filter topik, auth/role, CRUD CMS, canonical, kode, dan download tetap tersedia.
- Build production berhasil setelah tiap tahap yang menyentuh kode.

## 11. Catatan implementasi tahap awal — 12 November 2026

### Sudah dikerjakan

- Menyatukan token warna, tipografi, ukuran konten, fokus keyboard, dan beberapa pola tombol.
- Menghapus latar hero beranda dari pembungkus seluruh route; latar yang dikelola CMS kini hanya digunakan pada hero beranda.
- Membuat navigasi publik dan footer responsif, termasuk menu ponsel, pencarian, serta pintu masuk Portal.
- Menyusun ulang hero, lima kartu topik, kartu artikel pilihan, profil founder, newsletter, dan formulir kontak di beranda.
- Menyamakan shell CMS admin dan dashboard peran tanpa mengganti menu route atau pemeriksaan peran yang sudah ada.
- Memperbarui gaya halaman eksplorasi publikasi dan panel kode/tautan permanen.

### Belum dituntaskan

- Penerapan sistem visual ke daftar dan halaman detail proyek, layanan, insight, berita, serta halaman organisasi.
- Penyelarasan penuh form, tabel, status, dan tampilan kosong di setiap halaman CMS.
- Pemeriksaan visual desktop dan ponsel pada situs yang berjalan.

### Validasi saat ini

- DM Sans dan Newsreader sekarang diambil dari file WOFF2 lokal di `frontend/assets/fonts`, sehingga build tidak lagi meminta font ke Google Fonts.
- `npm run build` berhasil: TypeScript selesai dan semua 89 halaman statis berhasil dibuat.
- Tidak ada server development lokal yang dijalankan.
- Belum ada commit atau push. Perubahan masih berada di working tree untuk ditinjau.
