"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          minHeight: "60vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "80px 24px", textAlign: "center",
          background: "#F4F7F7",
        }}>
          <div style={{ marginBottom: "24px", fontSize: "48px", opacity: 0.3 }}>⚠</div>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "24px", fontWeight: 300, color: "#0F2830", marginBottom: "12px" }}>
            Terjadi kesalahan.
          </p>
          <p style={{ fontSize: "15px", fontWeight: 300, color: "#7A9AA5", marginBottom: "32px", maxWidth: "400px", lineHeight: 1.7 }}>
            Komponen ini tidak dapat dimuat saat ini. Coba muat ulang halaman.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{ background: "#266c87", color: "#fff", border: "none", borderRadius: "2px", padding: "12px 28px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Coba Lagi
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "transparent", color: "#3A5560", border: "1px solid rgba(38,108,135,0.2)", borderRadius: "2px", padding: "12px 24px", fontSize: "13px", cursor: "pointer" }}
            >
              Muat Ulang
            </button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details style={{ marginTop: "24px", textAlign: "left", maxWidth: "600px" }}>
              <summary style={{ fontSize: "12px", color: "#B8CDD2", cursor: "pointer" }}>Detail Error (dev only)</summary>
              <pre style={{ fontSize: "11px", color: "#f87171", background: "rgba(248,113,113,0.06)", padding: "12px", borderRadius: "2px", marginTop: "8px", overflow: "auto" }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}