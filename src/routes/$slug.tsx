import { createFileRoute, notFound } from "@tanstack/react-router";
import { fetchPublicLandingBySlug } from "@/hooks/useClientLanding";
import { LandingView } from "@/components/landing/LandingView";
import { RESERVED_SLUGS } from "@/lib/landing-icons";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (RESERVED_SLUGS.has(params.slug)) throw notFound();
  },
  loader: async ({ params }) => {
    const landing = await fetchPublicLandingBySlug(params.slug);
    if (!landing) throw notFound();
    return { landing };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ name: "robots", content: "noindex" }] };
    const name = loaderData.landing.client.name || params.slug;
    const title = `${name} — Friuli On`;
    const description = `Tutti i link e le informazioni di ${name} su Friuli On.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
      ],
      links: [{ rel: "canonical", href: `https://friulion.it/${params.slug}` }],
    };
  },
  component: SlugPage,
});

function SlugPage() {
  const { landing } = Route.useLoaderData();
  return <LandingView landing={landing} />;
}
