import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/keys", "/dashboard/logs"],
    },
    sitemap: "https://gravixhost.app/sitemap.xml",
  };
}
