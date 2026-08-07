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
      { property: "og:url", content: "https://friulion.it/chi-siamo" },
    ],
    links: [{ rel: "canonical", href: "https://friulion.it/chi-siamo" }],
  }),
  component: ChiSiamoPage,
});

function ChiSiamoPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 md:px-8 md:pt-16 md:pb-10">
          <p className="font-heading text-xs uppercase tracking-widest text-friuli-blue">Chi siamo</p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] md:text-6xl xl:text-7xl">Comunicazione locale, fatta in Friuli</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">Friuli On nasce per rendere la pubblicità locale accessibile, efficace e sostenibile, connettendo imprese e comunità del territorio.</p>
        </section>
        <About />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
