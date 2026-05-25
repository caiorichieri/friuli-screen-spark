import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://friulion.it";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// NOTE: rotte escluse dalla sitemap (non indicizzabili):
// /login, /forgot-password, /reset-password, /admin e tutte le sue sotto-rotte,
// /dashboard, /landing/*. Per escludere una rotta, semplicemente non aggiungerla qui.
const EXCLUDED_PATHS = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/dashboard",
] as const;
const EXCLUDED_PREFIXES = ["/admin", "/landing"] as const;

const allEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/circuito", changefreq: "weekly", priority: "0.9" },
  { path: "/servizi", changefreq: "weekly", priority: "0.9" },
  { path: "/chi-siamo", changefreq: "monthly", priority: "0.7" },
  { path: "/portfolio", changefreq: "monthly", priority: "0.7" },
  { path: "/clienti", changefreq: "weekly", priority: "0.8" },
  { path: "/contatti", changefreq: "monthly", priority: "0.8" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
];

const staticEntries: SitemapEntry[] = allEntries.filter(
  (e) =>
    !EXCLUDED_PATHS.includes(e.path as (typeof EXCLUDED_PATHS)[number]) &&
    !EXCLUDED_PREFIXES.some((prefix) => e.path === prefix || e.path.startsWith(`${prefix}/`)),
);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Fetch published client landings (enabled = true) with their slugs
        const dynamicEntries: SitemapEntry[] = [];
        try {
          const { data: landings } = await supabaseAdmin
            .from("client_landings")
            .select("client_id")
            .eq("enabled", true);
          const clientIds = (landings ?? []).map((l) => l.client_id);
          if (clientIds.length) {
            const { data: clients } = await supabaseAdmin
              .from("clients")
              .select("slug, is_public")
              .in("id", clientIds)
              .eq("is_public", true);
            for (const c of clients ?? []) {
              if (c.slug) {
                dynamicEntries.push({
                  path: `/${c.slug}`,
                  changefreq: "weekly",
                  priority: "0.6",
                });
              }
            }
          }
        } catch {
          // fail open: still return static sitemap if DB fetch fails
        }

        const entries = [...staticEntries, ...dynamicEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

