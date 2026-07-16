import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "abdou4art — software engineering student, learning by building";

// Social card echoing the hero's status-line motif.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17181c",
          color: "#fcfcfa",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#8b9bff" }}>
          portfolio · v0.1 · work in progress — like me
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700 }}>
            abdou4art
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#c9c9c4" }}>
            I&apos;m learning software engineering by building things.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 26,
            color: "#94969e",
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ color: "#8b9bff", width: 180 }}>status</span>
            <span>→ first-year GL student @ ENSIAS, Rabat</span>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#8b9bff", width: 180 }}>focus</span>
            <span>→ AI agents · LLMs · full-stack basics</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
