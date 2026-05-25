import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { usePublicLandingBySlug } from "@/hooks/useClientLanding";
import { LandingView } from "@/components/landing/LandingView";
import { RESERVED_SLUGS } from "@/lib/landing-icons";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (RESERVED_SLUGS.has(params.slug)) {
      throw notFound();
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Friuli On` },
      {
        name: "description",
        content: `Tutti i link e le informazioni di ${params.slug} su Friuli On.`,
      },
      { property: "og:title", content: `${params.slug} — Friuli On` },
      {
        property: "og:description",
        content: `Tutti i link e le informazioni di ${params.slug} su Friuli On.`,
      },
      { rel: "canonical", href: `https://friulion.it/${params.slug}` },
    ],
  }),
  component: SlugPage,
});

function SlugPage() {
  const { slug } = Route.useParams();
  const { data: landing, isLoading, isError } = usePublicLandingBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-cream/60">Caricamento...</p>
      </div>
    );
  }

  if (isError || !landing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div
          className="max-w-md rounded-3xl border-2 border-ink bg-cream p-8 text-center"
          style={{ boxShadow: "var(--shadow-brutal-lg)" }}
        >
          <h1 className="font-heading text-3xl uppercase">Pagina non trovata</h1>
          <p className="mt-3 text-ink/70">
            La landing page che cerchi non esiste o non è stata ancora pubblicata.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-friuli-yellow px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            Torna al sito
          </Link>
        </div>
      </div>
    );
  }

  return <LandingView landing={landing} />;
}
