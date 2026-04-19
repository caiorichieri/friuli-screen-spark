import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/servizi")({
  head: () => ({
    meta: [
      { title: "Servizi — SEO, Grafica, Volantini, Siti e App | Friuli On" },
      {
        name: "description",
        content:
          "I servizi di Friuli On: SEO locale, grafica, stampa volantini, creazione siti web, applicazioni e monitor indoor in Friuli Venezia Giulia.",
      },
      { property: "og:title", content: "Servizi di comunicazione locale — Friuli On" },
      {
        property: "og:description",
        content:
          "Una soluzione completa per la tua comunicazione: SEO, grafica, volantini, siti web, app e monitor TV indoor in FVG.",
      },
      { rel: "canonical", href: "https://friulion.it/servizi" },
    ],
  }),
  component: ServiziPage,
});

function ServiziPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <div className="mx-auto max-w-7xl px-6 pt-12 md:px-8 md:pt-16">
          <h1 className="sr-only">Servizi di comunicazione locale Friuli On</h1>
        </div>
        <Services />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
