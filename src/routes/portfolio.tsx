import { publicProjectsQuery, portfolioCategoriesQuery } from "@/hooks/usePublicData";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Portfolio } from "@/components/site/Portfolio";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/portfolio")({
  loader: async ({ context }) => {
    await Promise.allSettled([context.queryClient.ensureQueryData(publicProjectsQuery), context.queryClient.ensureQueryData(portfolioCategoriesQuery)]);
  },
  head: () => ({
    meta: [
      { title: "Portfolio — Progetti e campagne | Friuli On" },
      {
        name: "description",
        content:
          "Il portfolio di Friuli On: campagne, eventi, comunicazione integrata e progetti realizzati per attività del Friuli Venezia Giulia.",
      },
      { property: "og:title", content: "Portfolio Friuli On" },
      {
        property: "og:description",
        content:
          "Trasformiamo idee in realtà tangibili: scopri i nostri progetti e campagne in Friuli.",
      },
      { property: "og:url", content: "https://friulion.it/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://friulion.it/portfolio" }],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 md:px-8 md:pt-16 md:pb-10">
          <p className="font-heading text-xs uppercase tracking-widest text-friuli-blue">Portfolio</p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] md:text-6xl xl:text-7xl">Progetti e campagne realizzate</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">Campagne, eventi, siti web e comunicazione integrata per le attività del Friuli Venezia Giulia.</p>
        </section>
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
