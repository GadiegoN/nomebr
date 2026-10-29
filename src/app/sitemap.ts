import { MetadataRoute } from "next";
import { BRAND_CONFIG } from "@/config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BRAND_CONFIG.url;

  const topNames = [
    "maria",
    "jose",
    "ana",
    "joao",
    "antonio",
    "francisco",
    "carlos",
    "paulo",
    "pedro",
    "lucas",
    "luiz",
    "marcos",
    "gabriel",
    "rafael",
    "daniel",
    "marcelo",
    "bruno",
    "eduardo",
  ];

  const nameEntries = topNames.map((slug) => ({
    url: `${baseUrl}/nome/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...nameEntries,
  ];
}

