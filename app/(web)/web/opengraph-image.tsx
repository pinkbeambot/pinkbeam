import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/metadata";

export const runtime = "edge";

export const alt = "Pink Beam Web — Website Design & Development";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #0A0A0F 0%, #1a1a2e 50%, #0A0A0F 100%)",
          padding: "60px",
        }}
      >
        {/* Violet glow effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #FF006E 0%, #FF4D9E 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              P
            </span>
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #FFFFFF 0%, #FF006E 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Pink Beam
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "16px",
            maxWidth: "900px",
          }}
        >
          Web
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "32px",
            color: "#8B5CF6",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.3,
            marginBottom: "32px",
          }}
        >
          Website Design & Development
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Beautiful, fast, SEO-optimized websites that convert visitors into customers.
        </p>

        {/* Service badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["Design", "Development", "SEO", "Maintenance"].map((service) => (
            <div
              key={service}
              style={{
                padding: "12px 24px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "9999px",
                color: "#8B5CF6",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
