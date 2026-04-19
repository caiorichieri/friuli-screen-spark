import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://friulion.it";
const PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/circuito", priority: "0.9", changefreq: "weekly" },
  { path: "/servizi", priority: "0.9", changefreq: "weekly" },
  { path: "/chi-siamo", priority: "0.7", changefreq: "monthly" },
  { path: "/portfolio", priority: "0.7", changefreq: "monthly" },
  { path: "/contatti", priority: "0.8", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const lastmod = new Date().toISOString().split("T")[0];
        const urls = PAGES.map(
          (p) =>
            `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
