"use client";
import { useEffect, useState, CSSProperties } from "react";
import { settingsApi } from "@/lib/api";

export type GradientDirection =
  | "to-right"   // ilustrasi kanan, konten kiri
  | "to-left"    // ilustrasi kiri, konten kanan
  | "to-bottom"  // ilustrasi atas, konten bawah
  | "overlay";   // full overlay (gambar sebagai atmosphere)

interface Props {
  settingKey: string;               // key di database, misal "hero_bg_homepage"
  fallbackGradient?: string;        // gradient default kalau belum ada gambar
  gradientDirection?: GradientDirection;
  gradientColor?: string;           // warna dasar gradient (default: putih)
  gradientOpacity?: number;         // seberapa kuat gradient (0-1)
  height?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
}

// Map direction ke CSS gradient
function buildGradient(
  direction: GradientDirection,
  color: string,
  opacity: number
): string {
  const solid = hexToRgba(color, 1);
  const mid = hexToRgba(color, opacity * 0.7);
  const none = hexToRgba(color, 0);

  switch (direction) {
    case "to-right":
      // Gambar di kanan, fade ke kiri
      return `linear-gradient(to right, ${solid} 0%, ${solid} 40%, ${mid} 65%, ${none} 100%)`;
    case "to-left":
      // Gambar di kiri, fade ke kanan
      return `linear-gradient(to left, ${solid} 0%, ${solid} 40%, ${mid} 65%, ${none} 100%)`;
    case "to-bottom":
      // Gambar di atas, fade ke bawah
      return `linear-gradient(to bottom, ${none} 0%, ${mid} 60%, ${solid} 100%)`;
    case "overlay":
    default:
      // Full overlay, gambar sebagai atmosphere
      return `linear-gradient(135deg, ${solid} 0%, ${mid} 50%, ${hexToRgba(color, opacity * 0.4)} 100%)`;
  }
}

function hexToRgba(hex: string, alpha: number): string {
  // Handle hex shorthand & full
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function HeroBackground({
  settingKey,
  fallbackGradient = "linear-gradient(135deg, #0F2830, #266c87)",
  gradientDirection = "to-right",
  gradientColor = "#ffffff",
  gradientOpacity = 0.95,
  height = "100%",
  children,
  style,
  className,
}: Props) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    settingsApi.get(settingKey)
      .then(r => {
        const url = r.data.data;
        if (url && typeof url === "string" && url.startsWith("http")) {
          setBgUrl(url);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [settingKey]);

  const gradient = buildGradient(gradientDirection, gradientColor, gradientOpacity);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Layer 1: Background image atau fallback gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bgUrl
          ? `url(${bgUrl}) center top / cover no-repeat`
            : fallbackGradient,
          transition: "opacity 0.6s ease",
          opacity: loaded ? 1 : 0,
        }}
      />

      {/* Layer 2: Gradient overlay */}
      {bgUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: gradient,
            zIndex: 1,
          }}
        />
      )}

      {/* Layer 3: Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}