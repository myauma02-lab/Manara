import Link from "next/link";

const ACTIONS = [
  { href: "/dashboard/ops/layanan", title: "Layanan", description: "Perbarui informasi dan isi halaman layanan." },
  { href: "/dashboard/ops/harga", title: "Skema Harga", description: "Kelola acuan harga layanan." },
  { href: "/dashboard/ops/vendor", title: "Vendor & Mitra", description: "Kelola informasi kerja sama." },
];

export default function OpsDashboardPage() {
  return <div style={{ padding: "clamp(20px,4vw,40px)", maxWidth: 1100 }}>
    <p style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#627985" }}>Operasional</p>
    <h1 style={{ color: "#173642", fontSize: "clamp(28px,4vw,40px)", margin: "8px 0" }}>Dashboard Operasional</h1>
    <p style={{ color: "#627985", marginBottom: 32 }}>Akses cepat untuk pengelolaan layanan, harga, dan mitra Manara.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
      {ACTIONS.map(action => <Link key={action.href} href={action.href} style={{ display: "block", padding: 24, border: "1px solid #dce6e8", borderRadius: 8, background: "#fff", textDecoration: "none", color: "#173642" }}>
        <h2 style={{ margin: "0 0 10px", fontSize: 20 }}>{action.title}</h2>
        <p style={{ color: "#627985", lineHeight: 1.6, margin: "0 0 20px" }}>{action.description}</p>
        <span style={{ color: "#266c87", fontWeight: 600 }}>Buka →</span>
      </Link>)}
    </div>
  </div>;
}
