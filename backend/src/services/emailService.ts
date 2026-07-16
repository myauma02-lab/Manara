import nodemailer from "nodemailer";

console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.SMTP_USER,
});

// Buat transporter — akan null kalau SMTP belum dikonfigurasi
export const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const FROM = process.env.EMAIL_FROM || "Manara <manararesearch@gmail.com>";
const ADMIN = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "manararesearch@gmail.com";

// Base HTML template
const template = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:40px 20px;background:#F4F7F7;font-family:Georgia,serif;color:#1C3038;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;border:1px solid rgba(38,108,135,0.1);">
    
    <div style="background:#0F2830;padding:28px 36px;">
      <p style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#EEF4F6;margin:0;letter-spacing:0.04em;">Manara</p>
      <p style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(134,175,170,0.5);margin:6px 0 0;">
        ${title}
      </p>
    </div>

    <div style="padding:32px 36px;">
      ${content}
    </div>

    <div style="padding:20px 36px;border-top:1px solid rgba(38,108,135,0.08);background:rgba(38,108,135,0.02);">
      <p style="font-size:12px;color:rgba(134,175,170,0.4);margin:0;font-style:italic;">
        "Shaping Ideas for the Public Sphere" — manara.my.id
      </p>
    </div>
  </div>
</body>
</html>`;

const infoBox = (label: string, value: string) => `
<div style="background:rgba(38,108,135,0.04);border:1px solid rgba(38,108,135,0.1);border-radius:2px;padding:14px 18px;margin-bottom:12px;">
  <p style="font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#B8CDD2;margin:0 0 4px;">${label}</p>
  <p style="font-size:15px;color:#0F2830;margin:0;">${value}</p>
</div>`;

const btn = (text: string, href: string) => `
<a href="${href}" style="display:inline-block;background:#266c87;color:#fff;padding:12px 28px;border-radius:2px;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;margin-top:8px;">
  ${text}
</a>`;

// ── Kirim email (safe — tidak crash kalau SMTP belum setup) ──
const send = async (to: string, subject: string, html: string) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email Skip] SMTP belum dikonfigurasi. To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
  } catch (err) {
    console.error(`[Email Error] To: ${to} | Subject: ${subject}`, err);
  }
};

// ── 1. Notifikasi pesan kontak ke admin ──
export const sendContactNotification = async (data: {
  name: string; email: string; purpose: string; message: string;
}) => {
  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Ada pesan baru masuk dari form kontak website Manara.
    </p>
    ${infoBox("Dari", data.name)}
    ${infoBox("Email", data.email)}
    ${infoBox("Tujuan", data.purpose || "Umum")}
    ${infoBox("Pesan", data.message)}
    ${btn("Balas Email", `mailto:${data.email}`)}
  `;
  await send(ADMIN, `[Manara] Pesan baru dari ${data.name}`, template("Pesan Kontak Masuk", content));
};

// ── 2. Konfirmasi ke pengirim kontak ──
export const sendContactConfirmation = async (data: {
  name: string; email: string;
}) => {
  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Halo <strong style="color:#0F2830;">${data.name}</strong>,
    </p>
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Pesan kamu telah kami terima. Tim Manara akan merespons dalam 1–3 hari kerja.
    </p>
    ${btn("Kunjungi Manara", "https://manara.my.id")}
  `;
  await send(data.email, "[Manara] Pesan kamu telah kami terima", template("Konfirmasi Pesan", content));
};

// ── 3. Konfirmasi newsletter ke subscriber ──
export const sendNewsletterConfirmation = async (data: {
  email: string; name?: string;
}) => {
  const greeting = data.name ? `Halo <strong style="color:#0F2830;">${data.name}</strong>` : "Halo";
  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      ${greeting}, terima kasih telah berlangganan <strong>Surat Manara</strong>.
    </p>
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Kamu akan menerima newsletter mingguan berisi gagasan, analisis, dan kurasi konten terbaik dari tim Manara.
    </p>
    <div style="background:#0F2830;border-radius:4px;padding:24px;margin:20px 0;">
      <p style="font-family:Georgia,serif;font-size:18px;font-weight:300;font-style:italic;color:rgba(238,244,246,0.8);margin:0;">
        "Kami tidak mengangkat suara untuk didengar — kami mendalamkannya."
      </p>
    </div>
    ${btn("Baca Artikel Terbaru", "https://manara.my.id/artikel")}
  `;
  await send(data.email, "[Manara] Selamat datang di Surat Manara", template("Langganan Newsletter", content));
};

// ── 4. Notifikasi lamaran ke admin ──
export const sendApplicationNotification = async (data: {
  fullName: string; email: string; position: string; batchName: string; appId: string;
}) => {
  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Ada lamaran baru masuk untuk program Manapeople.
    </p>
    ${infoBox("Nama Pelamar", data.fullName)}
    ${infoBox("Email", data.email)}
    ${infoBox("Posisi", data.position)}
    ${infoBox("Batch", data.batchName)}
    ${infoBox("ID Lamaran", data.appId)}
    ${btn("Tinjau di Dashboard", `https://manara.my.id/admin/recruitment`)}
  `;
  await send(
    ADMIN,
    `[Manara] Lamaran baru — ${data.fullName} · ${data.position}`,
    template("Lamaran Manapeople Baru", content)
  );
};

// ── 5. Konfirmasi ke pelamar ──
export const sendApplicationConfirmation = async (data: {
  fullName: string; email: string; position: string; appId: string;
}) => {
  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Halo <strong style="color:#0F2830;">${data.fullName}</strong>,
    </p>
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Lamaran kamu untuk posisi <strong style="color:#0F2830;">${data.position}</strong> telah kami terima. 
      Tim Manara akan meninjau lamaranmu dan menghubungimu melalui email ini.
    </p>
    ${infoBox("ID Lamaran", data.appId)}
    <p style="font-size:13px;color:#7A9AA5;margin:16px 0 20px;line-height:1.7;">
      Simpan ID ini sebagai referensi. Proses seleksi biasanya memakan waktu 7–14 hari.
    </p>
    ${btn("Tentang Manara", "https://manara.my.id/tentang")}
  `;
  await send(
    data.email,
    `[Manara] Lamaranmu telah diterima — ${data.position}`,
    template("Konfirmasi Lamaran Manapeople", content)
  );
};

// ── 6. Update status lamaran ke pelamar ──
export const sendStatusUpdateEmail = async (data: {
  fullName: string; email: string; position: string;
  status: string; adminNotes?: string;
}) => {
  const statusMap: Record<string, { label: string; pesan: string; color: string }> = {
    REVIEWING: {
      label: "Sedang Ditinjau",
      pesan: "Lamaranmu sedang dalam proses peninjauan oleh tim seleksi Manara.",
      color: "#266c87",
    },
    SHORTLISTED: {
      label: "Masuk Shortlist",
      pesan: "Selamat! Lamaranmu masuk ke tahap selanjutnya. Tim Manara akan segera menghubungimu untuk informasi lebih lanjut.",
      color: "#3F6F6A",
    },
    ACCEPTED: {
      label: "Diterima",
      pesan: "Selamat bergabung di Manara! Kamu resmi menjadi bagian dari kolektif kami. Tim akan segera menghubungimu untuk onboarding.",
      color: "#3F6F6A",
    },
    REJECTED: {
      label: "Belum Bisa Bergabung",
      pesan: "Terima kasih atas minat dan waktu yang kamu berikan. Setelah proses seleksi yang ketat, kami belum dapat menerima lamaranmu pada batch ini. Jangan menyerah — kami membuka batch baru secara berkala.",
      color: "#7A9AA5",
    },
  };

  const info = statusMap[data.status];
  if (!info) return;

  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Halo <strong style="color:#0F2830;">${data.fullName}</strong>,
    </p>
    <div style="border-left:3px solid ${info.color};padding:16px 20px;background:rgba(38,108,135,0.04);margin-bottom:20px;">
      <p style="font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#B8CDD2;margin:0 0 6px;">Status Lamaranmu</p>
      <p style="font-size:20px;font-weight:500;color:${info.color};margin:0;">${info.label}</p>
    </div>
    ${infoBox("Posisi", data.position)}
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      ${info.pesan}
    </p>
    ${data.adminNotes ? infoBox("Catatan dari Tim Manara", data.adminNotes) : ""}
    ${btn("Kunjungi Manara", "https://manara.my.id")}
  `;

  await send(
    data.email,
    `[Manara] Update lamaran — ${info.label}`,
    template("Pembaruan Status Lamaran", content)
  );
};

// ── 7. Notifikasi subscriber baru ke admin ──
export const sendNewSubscriberNotification = async (data: {
  email: string; name?: string;
}) => {
  const content = `
    <p style="font-size:15px;font-weight:300;color:#3A5560;line-height:1.8;margin:0 0 20px;">
      Ada subscriber baru untuk Surat Manara.
    </p>
    ${infoBox("Email", data.email)}
    ${data.name ? infoBox("Nama", data.name) : ""}
    ${btn("Lihat Semua Subscriber", "https://manara.my.id/admin/newsletter")}
  `;
  await send(ADMIN, `[Manara] Subscriber baru — ${data.email}`, template("Subscriber Newsletter Baru", content));
};