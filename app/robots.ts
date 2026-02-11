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
          "/portal",
          "/agents/portal",
          "/web/portal",
          "/admin",
          "/web/admin",
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
