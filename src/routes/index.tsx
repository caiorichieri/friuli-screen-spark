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
  head: () => ({
    meta: [
      { title: "Friuli On — Monitor TV indoor in Friuli VG" },
      {
        name: "description",
        content:
          "Rete di monitor TV indoor nei luoghi più frequentati del Friuli Venezia Giulia. Pubblicità locale accessibile ed efficace.",
      },
      { property: "og:title", content: "Friuli On — Monitor indoor in Friuli VG" },
      {
        property: "og:description",
        content:
          "Monitor TV indoor in bar, farmacie e palestre del Friuli per dare visibilità alle attività locali.",
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
