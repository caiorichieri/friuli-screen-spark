import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Friuli On | Codroipo (UD)" },
      {
        name: "description",
        content:
          "Contatta Friuli On: Via Circonvallazione Sud 80, Codroipo (UD). Tel +39 351 8230667, info@friulion.it. Pubblicità locale e monitor indoor in FVG.",
      },
      { property: "og:title", content: "Contatta Friuli On" },
      {
        property: "og:description",
        content:
          "Telefono, email e WhatsApp per parlare con il team di Friuli On a Codroipo.",
      },
      { property: "og:url", content: "https://friulion.it/contatti" },
    ],
    links: [{ rel: "canonical", href: "https://friulion.it/contatti" }],
  }),
  component: ContattiPage,
});

function ContattiPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 md:px-8 md:pt-16 md:pb-10">
          <p className="font-heading text-xs uppercase tracking-widest text-friuli-blue">Contatti</p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] md:text-6xl xl:text-7xl">Parliamo del tuo progetto</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">Siamo a Codroipo (UD). Scrivici o chiamaci: ti rispondiamo con una proposta concreta per la tua attività.</p>
        </section>
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
