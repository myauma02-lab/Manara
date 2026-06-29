// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Manara";
  const subtitle = searchParams.get("subtitle") || "Shaping Ideas for the Public Sphere";
  const type = searchParams.get("type") || "Artikel";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#0F2830",
          padding: "0",
          position: "relative",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 60% at 15% 85%, rgba(38,108,135,0.35) 0%, transparent 55%)",
          }}
        />

        {/* Left accent line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: "60px", bottom: 0,
            width: "1px",
            background: "linear-gradient(to bottom, transparent 0%, rgba(38,108,135,0.3) 40%, rgba(38,108,135,0.08) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "80px 100px",
            height: "100%",
          }}
        >
          {/* Type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <div style={{ width: "40px", height: "1px", background: "rgba(134,175,170,0.5)" }} />
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(134,175,170,0.7)",
                margin: 0,
              }}
            >
              {type}
            </p>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 60 ? "48px" : "64px",
              fontWeight: 300,
              color: "#EEF4F6",
              lineHeight: 1.15,
              margin: "0 0 24px 0",
              maxWidth: "900px",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: "22px",
                fontWeight: 300,
                color: "rgba(134,175,170,0.5)",
                margin: "0 0 48px 0",
                maxWidth: "700px",
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid rgba(38,108,135,0.15)",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                fontWeight: 300,
                color: "rgba(238,244,246,0.9)",
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              Manara
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 300,
                color: "rgba(134,175,170,0.35)",
                margin: 0,
                letterSpacing: "0.08em",
              }}
            >
              manara.id
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}