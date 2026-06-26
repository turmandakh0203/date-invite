import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size    = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "22%",
        }}
      >
        <span style={{ fontSize: 300 }}>✈️</span>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
