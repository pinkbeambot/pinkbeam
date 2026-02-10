import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/agents/dashboard",
          "/web/dashboard",
          "/labs/dashboard",
          "/solutions/dashboard",
          "/sign-in",
          "/sign-up",
          "/auth/callback",
          "/api/",
          "/_next/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard",
          "/agents/dashboard",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://pinkbeam.io/sitemap.xml",
    host: "https://pinkbeam.io",
  };
}
