// lib/utils.ts — tambahkan helper ini:
export function convertGDriveLink(url: string): string {
  // Dari: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Ke:   https://drive.google.com/file/d/FILE_ID/preview
  if (!url.includes("drive.google.com")) return url;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return url;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

// Untuk download langsung:
export function gDriveDownloadLink(url: string): string {
  if (!url.includes("drive.google.com")) return url;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return url;
  return `https://drive.google.com/uc?export=download&id=${match[1]}`;
}