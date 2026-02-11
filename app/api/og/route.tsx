import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const { searchParams } = request.url
    ? new URL(request.url)
    : { searchParams: new URLSearchParams() };

  const title = searchParams.get("title") || "Pink Beam";
  const subtitle = searchParams.get("subtitle") || "AI Employees for Your Business";
  const type = searchParams.get("type") || "default";
  const employeeName = searchParams.get("employee") || "";

  // Brand colors
  const pinkColor = "#FF006E";
  const darkBg = "#0A0A0F";
  const lightText = "#FAFAFA";

  // Generate dynamic content based on type
  let mainContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: lightText,
          marginBottom: 24,
          fontFamily: "Space Grotesk",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#A1A1AA",
          fontFamily: "Inter",
          maxWidth: 800,
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </div>
    </div>
  );

  if (type === "employee" && employeeName) {
    mainContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              background: pinkColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 700,
              color: "white",
              fontFamily: "Space Grotesk",
            }}
          >
            {employeeName.charAt(0)}
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: lightText,
            marginBottom: 16,
            fontFamily: "Space Grotesk",
            letterSpacing: "-0.02em",
          }}
        >
          Meet {employeeName}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#A1A1AA",
            fontFamily: "Inter",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      </div>
    );
  }

  if (type === "pricing") {
    mainContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: lightText,
            marginBottom: 24,
            fontFamily: "Space Grotesk",
            letterSpacing: "-0.02em",
          }}
        >
          Simple Pricing
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: pinkColor,
            marginBottom: 16,
            fontFamily: "Space Grotesk",
          }}
        >
          $397/month
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#A1A1AA",
            fontFamily: "Inter",
            maxWidth: 700,
          }}
        >
          Per AI employee. No hidden fees.
        </div>
      </div>
    );
  }

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
          background: darkBg,
          padding: 64,
          position: "relative",
        }}
      >
        {/* Background gradient accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: pinkColor,
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: pinkColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: lightText,
              fontFamily: "Space Grotesk",
            }}
          >
            Pink Beam
          </span>
        </div>

        {/* Main content */}
        {mainContent}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 20,
            color: "#71717A",
            fontFamily: "Inter",
          }}
        >
          <span>pinkbeam.io</span>
          <span style={{ color: pinkColor }}>•</span>
          <span>Hire AI Employees</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
