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
      { rel: "canonical", href: "https://friulion.it/contatti" },
    ],
  }),
  component: ContattiPage,
});

function ContattiPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
