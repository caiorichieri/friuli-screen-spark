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
      { property: "og:url", content: "https://friulion.it/circuito" },
    ],
    links: [{ rel: "canonical", href: "https://friulion.it/circuito" }],
  }),
  component: CircuitoPage,
});

function CircuitoPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 md:px-8 md:pt-16 md:pb-10">
          <p className="font-heading text-xs uppercase tracking-widest text-friuli-blue">Il circuito</p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] md:text-6xl xl:text-7xl">Monitor TV indoor in tutto il Friuli</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">Schermi nei bar, nelle farmacie e nelle palestre di 11 comuni del Friuli Venezia Giulia: la tua pubblicità dove le persone passano davvero il loro tempo.</p>
        </section>
        <IndoorMonitors />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
