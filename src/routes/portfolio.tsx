import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Portfolio } from "@/components/site/Portfolio";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/portfolio")({
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
      { rel: "canonical", href: "https://friulion.it/portfolio" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
