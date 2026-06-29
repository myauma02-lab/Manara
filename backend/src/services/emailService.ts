// src/services/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || "Manara <hello@manara.id>";
const ADMIN_EMAIL = process.env.SMTP_USER || "hello@manara.id";

// Template dasar
const baseTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Georgia', serif; background: #F4F7F7; margin: 0; padding: 40px 20px; color: #1C3038; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; border: 1px solid rgba(38,108,135,0.1); }
    .header { background: #0F2830; padding: 32px 40px; }
    .header h1 { font-family: Georgia, serif; font-size: 24px; font-weight: 300; color: #EEF4F6; margin: 0; letter-spacing: 0.04em; }
    .header p { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(134,175,170,0.5); margin: 6px 0 0; }
    .body { padding: 36px 40px; }
    .body p { font-size: 15px; font-weight: 300; line-height: 1.8; color: #3A5560; margin: 0 0 16px; }
    .info-box { background: rgba(38,108,135,0.04); border: 1px solid rgba(38,108,135,0.1); border-radius: 2px; padding: 20px 24px; margin: 20px 0; }
    .info-box .label { font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #B8CDD2; margin-bottom: 4px; }
    .info-box .value { font-size: 15px; color: #0F2830; font-weight: 400; }
    .btn { display: inline-block; background: #266c87; color: #fff; padding: 12px 28px; border-radius: 2px; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 8px; }
    .footer { padding: 20px 40px; border-top: 1px solid rgba(38,108,135,0.08); }
    .footer p { font-size: 12px; color: rgba(134,175,170,0.4); margin: 0; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Manara</h1>
      <p>${title}</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>"Shaping Ideas for the Public Sphere"</p>
    </div>
  </div>
</body>
</html>
`;

// Kirim notifikasi pesan kontak ke admin
export const sendContactNotification = async (data: {
  name: string; email: string; purpose: string; message: string;
}) => {
  if (!process.env.SMTP_USER) return; // Skip jika SMTP belum dikonfigurasi

  const content = `
    <p>Ada pesan baru masuk dari form kontak website Manara.</p>
    <div class="info-box">
      <div class="label">Nama</div>
      <div class="value">${data.name}</div>
    </div>
    <div class="info-box">
      <div class="label">Email</div>
      <div class="value">${data.email}</div>
    </div>
    <div class="info-box">
      <div class="label">Tujuan</div>
      <div class="value">${data.purpose || "Umum"}</div>
    </div>
    <div class="info-box">
      <div class="label">Pesan</div>
      <div class="value">${data.message}</div>
    </div>
    <a href="mailto:${data.email}" class="btn">Balas Email</a>
  `;

  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[Manara] Pesan baru dari ${data.name}`,
    html: baseTemplate("Pesan Kontak Masuk", content),
  });
};

// Kirim notifikasi lamaran ke admin
export const sendApplicationNotification = async (data: {
  fullName: string; email: string; position: string; batchName: string;
}) => {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p>Ada lamaran baru masuk untuk program Manapeople.</p>
    <div class="info-box">
      <div class="label">Nama Pelamar</div>
      <div class="value">${data.fullName}</div>
    </div>
    <div class="info-box">
      <div class="label">Email</div>
      <div class="value">${data.email}</div>
    </div>
    <div class="info-box">
      <div class="label">Posisi</div>
      <div class="value">${data.position}</div>
    </div>
    <div class="info-box">
      <div class="label">Batch</div>
      <div class="value">${data.batchName}</div>
    </div>
    <a href="${process.env.FRONTEND_URL}/admin/recruitment" class="btn">Lihat Lamaran</a>
  `;

  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[Manara] Lamaran baru — ${data.fullName} · ${data.position}`,
    html: baseTemplate("Lamaran Manapeople Baru", content),
  });
};

// Kirim konfirmasi ke pelamar
export const sendApplicationConfirmation = async (data: {
  fullName: string; email: string; position: string; appId: string;
}) => {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p>Halo <strong>${data.fullName}</strong>,</p>
    <p>Terima kasih telah mengirimkan lamaran untuk posisi <strong>${data.position}</strong> di Manara. Kami telah menerima lamaranmu dan akan meninjauanya segera.</p>
    <div class="info-box">
      <div class="label">ID Lamaranmu</div>
      <div class="value" style="font-family: monospace;">${data.appId}</div>
    </div>
    <p>Simpan ID ini untuk memantau status lamaranmu. Kami akan menghubungimu melalui email ini jika ada pembaruan.</p>
    <p style="margin-top: 24px; font-size: 14px; color: #7A9AA5;">
      Dengan semangat intelektual,<br/>
      <strong style="color: #0F2830;">Tim Manara</strong>
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: `[Manara] Lamaranmu telah diterima — ${data.position}`,
    html: baseTemplate("Konfirmasi Lamaran", content),
  });
};

// Kirim konfirmasi newsletter
export const sendNewsletterConfirmation = async (data: {
  email: string; name?: string;
}) => {
  if (!process.env.SMTP_USER) return;

  const content = `
    <p>Halo${data.name ? ` <strong>${data.name}</strong>` : ""},</p>
    <p>Kamu telah berlangganan <strong>Surat Manara</strong> — newsletter mingguan berisi gagasan, wawasan, dan kurasi konten terbaik dari Manara.</p>
    <p>Yang bisa kamu harapkan:</p>
    <div class="info-box">
      <div class="value">✦ Gagasan dan perspektif dari tim editorial Manara</div>
    </div>
    <div class="info-box">
      <div class="value">◎ Ringkasan artikel & riset terbaru</div>
    </div>
    <div class="info-box">
      <div class="value">○ Info program, forum, dan acara Manara</div>
    </div>
    <p style="margin-top: 24px; font-size: 14px; color: #7A9AA5;">
      Dengan semangat intelektual,<br/>
      <strong style="color: #0F2830;">Tim Manara</strong>
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: "[Manara] Selamat datang di Surat Manara",
    html: baseTemplate("Langganan Newsletter", content),
  });
};

// Kirim notif status lamaran berubah
export const sendStatusUpdateEmail = async (data: {
  fullName: string; email: string; position: string;
  status: string; adminNotes?: string;
}) => {
  if (!process.env.SMTP_USER) return;

  const statusMap: Record<string, { label: string; message: string }> = {
    REVIEWING: { label: "Sedang Ditinjau", message: "Lamaranmu sedang dalam proses peninjauan oleh tim Manara." },
    SHORTLISTED: { label: "Masuk Shortlist", message: "Selamat! Lamaranmu masuk ke dalam daftar kandidat yang kami pertimbangkan lebih lanjut." },
    ACCEPTED: { label: "Diterima", message: "Selamat! Kami dengan senang hati menerima kamu sebagai bagian dari Manara. Tim kami akan segera menghubungimu untuk langkah selanjutnya." },
    REJECTED: { label: "Tidak Lolos Seleksi", message: "Terima kasih atas minat dan waktu yang telah kamu berikan. Setelah melalui proses seleksi yang ketat, kami belum bisa menerima lamaranmu pada batch ini." },
  };

  const statusInfo = statusMap[data.status];
  if (!statusInfo) return;

  const content = `
    <p>Halo <strong>${data.fullName}</strong>,</p>
    <p>Ada pembaruan status untuk lamaranmu sebagai <strong>${data.position}</strong> di Manara.</p>
    <div class="info-box">
      <div class="label">Status Terbaru</div>
      <div class="value" style="color: #266c87; font-weight: 500;">${statusInfo.label}</div>
    </div>
    <p>${statusInfo.message}</p>
    ${data.adminNotes ? `
    <div class="info-box">
      <div class="label">Catatan dari Tim Manara</div>
      <div class="value">${data.adminNotes}</div>
    </div>` : ""}
    <p style="margin-top: 24px; font-size: 14px; color: #7A9AA5;">
      Dengan semangat intelektual,<br/>
      <strong style="color: #0F2830;">Tim Manara</strong>
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: `[Manara] Update lamaran — ${statusInfo.label}`,
    html: baseTemplate("Pembaruan Status Lamaran", content),
  });
};