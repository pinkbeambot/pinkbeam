import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portal",
          "/admin",
          "/sign-in",
          "/sign-up",
          "/reset-password",
          "/auth/",
          "/api/",
          "/_next/",
          "/*.json$",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/portal",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://pinkbeam.io/sitemap.xml",
    host: "https://pinkbeam.io",
  };
}
