"use client";
import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      height: "3px",
      zIndex: 100,
      background: "rgba(38,108,135,0.1)",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "linear-gradient(to right, #266c87, #5F8F8A)",
        transition: "width 0.1s linear",
      }} />
    </div>
  );
}