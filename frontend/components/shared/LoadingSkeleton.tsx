// Skeleton loader untuk kartu artikel, paper, dll
export function CardSkeleton() {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(38,108,135,0.08)",
      borderRadius: "4px",
      overflow: "hidden",
      animation: "shimmer 1.5s infinite",
    }}>
      <div style={{ aspectRatio: "16/9", background: "rgba(38,108,135,0.06)" }} />
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "10px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "30%" }} />
        <div style={{ height: "20px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "90%" }} />
        <div style={{ height: "20px", background: "rgba(38,108,135,0.06)", borderRadius: "2px", width: "70%" }} />
        <div style={{ height: "12px", background: "rgba(38,108,135,0.04)", borderRadius: "2px", width: "50%", marginTop: "8px" }} />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function TextSkeleton({ width = "100%", height = "16px" }: { width?: string; height?: string }) {
  return (
    <div style={{
      height, width,
      background: "rgba(38,108,135,0.06)",
      borderRadius: "2px",
      animation: "shimmer 1.5s infinite",
    }}>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}