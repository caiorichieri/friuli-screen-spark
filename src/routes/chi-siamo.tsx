import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi Siamo — Friuli On | Comunicazione locale in FVG" },
      {
        name: "description",
        content:
          "Friuli On nasce per rendere la pubblicità locale accessibile, efficace e sostenibile. Connettiamo imprese e comunità del Friuli Venezia Giulia.",
      },
      { property: "og:title", content: "Chi Siamo — Friuli On" },
      {
        property: "og:description",
        content:
          "Tradizione, innovazione e comunità: scopri chi siamo e perché abbiamo creato Friuli On.",
      },
      { rel: "canonical", href: "https://friulion.it/chi-siamo" },
    ],
  }),
  component: ChiSiamoPage,
});

function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <About />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
