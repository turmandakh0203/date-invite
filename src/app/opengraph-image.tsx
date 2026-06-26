import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "✈️ Аяллын төлөвлөгөө — Travel Planner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 60%, #22D3EE 100%)",
          position: "relative",
        }}
      >
        {/* Background decorative circles */}
        <div style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          display: "flex",
        }} />

        {/* Main card */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255,255,255,0.15)",
          borderRadius: 40,
          padding: "52px 80px",
          border: "2px solid rgba(255,255,255,0.3)",
        }}>
          {/* Plane icon */}
          <div style={{ fontSize: 96, marginBottom: 20, display: "flex" }}>✈️</div>

          {/* Title */}
          <div style={{
            fontSize: 68,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 16,
            display: "flex",
          }}>
            Travel Planner
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            marginBottom: 36,
            display: "flex",
          }}>
            Plan your perfect trip together
          </div>

          {/* Emoji row */}
          <div style={{
            display: "flex",
            gap: 20,
            background: "rgba(255,255,255,0.18)",
            padding: "16px 40px",
            borderRadius: 100,
          }}>
            {["🗺️", "🏞️", "🌊", "🏛️", "🌄", "🧳"].map((e) => (
              <span key={e} style={{ fontSize: 40, display: "flex" }}>{e}</span>
            ))}
          </div>
        </div>

        {/* URL tag at bottom */}
        <div style={{
          position: "absolute",
          bottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "rgba(255,255,255,0.7)",
          fontSize: 22,
        }}>
          date-invite-roan-chi.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
