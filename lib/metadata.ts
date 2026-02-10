import { Metadata } from "next";

// Base metadata configuration
export const siteConfig = {
  name: "Pink Beam",
  description: "AI-powered business solutions. Hire AI employees, build websites, develop custom software, or get strategic consulting.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pinkbeam.io",
  ogImage: "/og-image.png",
  twitterHandle: "@pinkbeam",
  authors: [{ name: "Pink Beam", url: "https://pinkbeam.io" }],
  keywords: [
    "AI employees",
    "artificial intelligence",
    "business automation",
    "web design",
    "web development",
    "custom software",
    "consulting",
    "AI workforce",
    "digital agency",
  ],
};

// Metadata templates for different page types
export const createMetadata = ({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata => {
  const fullTitle = title === siteConfig.name ? title : `${title} — ${siteConfig.name}`;
  const fullDescription = description || siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || siteConfig.ogImage;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
};

// Service-specific metadata
export const serviceMetadata = {
  home: {
    title: "Pink Beam",
    description: siteConfig.description,
    path: "/",
  },
  agents: {
    title: "AI Employees",
    description: "Hire AI employees for your business. AI researchers, sales reps, support agents, and more. Available 24/7, trained on your business.",
    path: "/agents",
    keywords: ["AI employees", "AI workers", "business automation", "AI agents"],
  },
  web: {
    title: "Web Services",
    description: "Professional website design, development, and SEO services. Fast, beautiful websites that convert visitors into customers.",
    path: "/web",
    keywords: ["web design", "web development", "SEO", "website agency"],
  },
  labs: {
    title: "Labs",
    description: "Custom software development for complex business challenges. AI integration, automation, and bespoke applications.",
    path: "/labs",
    keywords: ["custom software", "software development", "AI integration", "automation"],
  },
  solutions: {
    title: "Solutions",
    description: "Strategic consulting to transform your business with AI and technology. Fractional CTO, digital transformation, and growth strategy.",
    path: "/solutions",
    keywords: ["consulting", "digital transformation", "fractional CTO", "strategy"],
  },
  signIn: {
    title: "Sign In",
    description: "Sign in to your Pink Beam account to manage your AI employees, websites, and services.",
    path: "/sign-in",
    noIndex: true,
  },
  signUp: {
    title: "Sign Up",
    description: "Create your Pink Beam account and start building with AI employees, web services, and more.",
    path: "/sign-up",
    noIndex: true,
  },
  dashboard: {
    title: "Dashboard",
    description: "Manage your Pink Beam services, AI employees, and account settings.",
    path: "/dashboard",
    noIndex: true,
  },
};

// JSON-LD structured data generators
export const structuredData = {
  // Organization schema
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Pink Beam",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      "https://twitter.com/pinkbeam",
      "https://github.com/pinkbeambot",
    ],
    description: siteConfig.description,
  }),

  // SoftwareApplication schema for AI Employees
  softwareApplication: () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pink Beam AI Employees",
    applicationCategory: "BusinessApplication",
    description: "AI-powered employees that work 24/7 for your business",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "99.00",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
  }),

  // WebPage schema
  webPage: ({
    title,
    description,
    path,
    datePublished,
    dateModified,
  }: {
    title: string;
    description: string;
    path: string;
    datePublished?: string;
    dateModified?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteConfig.url}${path}`,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    isPartOf: {
      "@type": "WebSite",
      name: "Pink Beam",
      url: siteConfig.url,
    },
  }),

  // Service schema
  service: ({
    name,
    description,
    path,
    provider,
  }: {
    name: string;
    description: string;
    path: string;
    provider?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteConfig.url}${path}`,
    provider: {
      "@type": "Organization",
      name: provider || "Pink Beam",
      url: siteConfig.url,
    },
  }),
};
