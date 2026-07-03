"use client";

interface Props {
  content: string;
}

export default function WordCount({ content }: Props) {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").filter(w => w.length > 0).length : 0;
  const chars = text.length;
  const readTime = Math.max(1, Math.ceil(words / 200)); // 200 kata per menit

  if (words === 0) return null;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "10px 16px", background: "rgba(38,108,135,0.04)", borderRadius: "0 0 2px 2px", borderTop: "1px solid rgba(38,108,135,0.08)" }}>
      {[
        { label: "kata", value: words.toLocaleString("id") },
        { label: "karakter", value: chars.toLocaleString("id") },
        { label: "estimasi baca", value: `${readTime} menit` },
      ].map(item => (
        <div key={item.label} style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
          <span style={{ fontFamily: "Georgia,serif", fontSize: "16px", fontWeight: 300, color: "#266c87" }}>{item.value}</span>
          <span style={{ fontSize: "11px", color: "#B8CDD2", letterSpacing: "0.06em" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}