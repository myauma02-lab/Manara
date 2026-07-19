import { Suspense } from "react";
import LayananClient from "./LayananClient";
import HeroBackground from "@/components/shared/HeroBackground";
import { HERO_BG_KEYS } from "@/lib/hero-settings";
export default function Page() {
  return (
    <HeroBackground
      settingKey={HERO_BG_KEYS.layanan}
      fallbackGradient="linear-gradient(135deg, #0F2830, #266c87)"
      gradientDirection="to-right"
      gradientColor="#0F2830"
      gradientOpacity={0.90}
      style={{ paddingTop: "140px", minHeight: "320px" }}
    >
      {/* konten hero */}
      <Suspense fallback={<div />}>
        <LayananClient />
      </Suspense>
    </HeroBackground>
  );
}
