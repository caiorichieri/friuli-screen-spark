import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { IndoorMonitors } from "@/components/site/IndoorMonitors";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/circuito")({
  head: () => ({
    meta: [
      { title: "Il Circuito — Monitor TV indoor in Friuli | Friuli On" },
      {
        name: "description",
        content:
          "Il circuito Friuli On: monitor TV indoor in bar, farmacie e palestre di 11 comuni del Friuli Venezia Giulia. Pubblicità locale 24/7.",
      },
      { property: "og:title", content: "Il Circuito Friuli On — Monitor indoor in FVG" },
      {
        property: "og:description",
        content:
          "11 comuni, decine di schermi nei luoghi più frequentati del Friuli. Scopri dove siamo presenti.",
      },
      { rel: "canonical", href: "https://friulion.it/circuito" },
    ],
  }),
  component: CircuitoPage,
});

function CircuitoPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <IndoorMonitors />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
