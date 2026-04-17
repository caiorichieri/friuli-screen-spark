import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { IndoorMonitors } from "@/components/site/IndoorMonitors";
import { About } from "@/components/site/About";
import { Portfolio } from "@/components/site/Portfolio";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Friuli On — Pubblicità locale e monitor indoor in Friuli Venezia Giulia" },
      {
        name: "description",
        content:
          "Friuli On: rete di monitor TV indoor nei luoghi più frequentati del Friuli. Pubblicità locale accessibile, efficace e sostenibile a Codroipo, Lignano e altri 9 comuni.",
      },
      { property: "og:title", content: "Friuli On — Monitor indoor in Friuli Venezia Giulia" },
      {
        property: "og:description",
        content:
          "Una rete di monitor TV indoor in bar, farmacie e palestre del Friuli per dare visibilità alle attività locali.",
      },
    ],
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
        <About />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
