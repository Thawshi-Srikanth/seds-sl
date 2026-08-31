import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots.ts metadata route", () => {
  it("returns valid robots rules and sitemap URL", () => {
    const config = robots();

    expect(config).toBeDefined();
    expect(config.rules).toEqual([
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/wp-admin/",
          "/wp-content/",
          "/wp-includes/",
          "/wp-json/",
          "/xmlrpc.php",
          "/*.php$",
          "/*.php?*",
        ],
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
    ]);
    expect(config.sitemap).toContain("/sitemap.xml");
  });
});
