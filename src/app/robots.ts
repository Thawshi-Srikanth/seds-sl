import type { MetadataRoute } from "next";
import { getServerSideURL } from "@/utilities/getURL";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerSideURL();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "CCBot",
          "Bytespider",
          "SemrushBot",
          "AhrefsBot",
          "MJ12bot",
          "DotBot",
          "PetalBot",
          "DataForSeoBot",
          "Amazonbot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
