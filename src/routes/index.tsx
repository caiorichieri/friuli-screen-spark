import { publicClientsQuery, publicServicesQuery, publicProjectsQuery, portfolioCategoriesQuery } from "@/hooks/usePublicData";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { IndoorMonitors } from "@/components/site/IndoorMonitors";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Portfolio } from "@/components/site/Portfolio";
import { Contact } from "@/components/site/Contact";
import { ClientsMarquee } from "@/components/site/ClientsMarquee";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.allSettled([context.queryClient.ensureQueryData(publicClientsQuery), context.queryClient.ensureQueryData(publicServicesQuery), context.queryClient.ensureQueryData(publicProjectsQuery), context.queryClient.ensureQueryData(portfolioCategoriesQuery)]);
  },
  head: () => ({
    meta: [
      { title: "Friuli On — Pubblicità locale e monitor indoor in FVG" },
      {
        name: "description",
        content:
          "Monitor TV indoor in bar, farmacie e palestre del Friuli, più SEO, ADS, grafica e siti web. Richiedi un preventivo gratuito.",
      },
      { property: "og:title", content: "Friuli On — Pubblicità locale e monitor indoor in FVG" },
      {
        property: "og:description",
        content:
          "Monitor TV indoor in bar, farmacie e palestre del Friuli, più SEO, ADS, grafica e siti web. Richiedi un preventivo gratuito.",
      },
      { property: "og:url", content: "https://friulion.it/" },
    ],
    links: [{ rel: "canonical", href: "https://friulion.it/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <Hero />
        <IndoorMonitors />
        <Services />
        <About />
        <ClientsMarquee />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
