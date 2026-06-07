import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

const SERVIZI = [
  { name: "SEO locale", description: "Posizionamento sui motori di ricerca per farti trovare dai clienti del Friuli Venezia Giulia." },
  { name: "Grafica e brand identity", description: "Loghi, identità visiva e materiali coordinati che raccontano il tuo brand." },
  { name: "Stampa volantini", description: "Stampa professionale per promozioni, eventi e campagne mirate sul territorio." },
  { name: "Creazione siti web", description: "Siti web moderni, veloci e ottimizzati per mobile e SEO." },
  { name: "Applicazioni e software", description: "App su misura per la tua attività: gestionali, booking online, e-commerce." },
  { name: "Monitor TV indoor", description: "Rete di schermi nei luoghi più frequentati del Friuli per pubblicità locale 24/7." },
  { name: "Google e Meta ADS", description: "Campagne pubblicitarie su Google, Facebook e Instagram gestite e ottimizzate." },
];

const META_DESCRIPTION =
  "Servizi di comunicazione locale Friuli On: SEO, grafica, stampa volantini, siti web, applicazioni, Google e Meta ADS e monitor TV indoor in Friuli Venezia Giulia.";

const SERVIZI_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Servizi Friuli On",
  itemListElement: SERVIZI.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.name,
      description: s.description,
      provider: { "@type": "LocalBusiness", name: "Friuli On", url: "https://friulion.it" },
      areaServed: "Friuli Venezia Giulia",
    },
  })),
});

export const Route = createFileRoute("/servizi")({
  head: () => ({
    meta: [
      { title: "Servizi — SEO, Grafica, Volantini, Siti e App | Friuli On" },
      { name: "description", content: META_DESCRIPTION },
      { property: "og:title", content: "Servizi di comunicazione locale — Friuli On" },
      { property: "og:description", content: META_DESCRIPTION },
      { property: "og:url", content: "https://friulion.it/servizi" },
      { name: "twitter:title", content: "Servizi di comunicazione locale — Friuli On" },
      { name: "twitter:description", content: META_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://friulion.it/servizi" }],
    scripts: [{ type: "application/ld+json", children: SERVIZI_JSONLD }],
  }),
  component: ServiziPage,
});

function ServiziPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-6 pt-12 md:px-8 md:pt-20">
          <h1 className="font-heading text-4xl uppercase leading-[0.95] md:text-6xl">
            Servizi di comunicazione locale in Friuli
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-ink/80">
            Friuli On è l'agenzia di marketing digitale del Friuli Venezia Giulia. Offriamo
            SEO locale, grafica e brand identity, stampa di volantini, creazione di siti
            web e applicazioni, campagne Google e Meta ADS e una rete capillare di monitor
            TV indoor in bar, farmacie e palestre di 11 comuni del territorio.
          </p>
          <ul className="mt-8 grid gap-3 text-base text-ink/85 md:grid-cols-2">
            {SERVIZI.map((s) => (
              <li key={s.name} className="rounded-2xl border-2 border-ink bg-cream p-4">
                <strong className="font-heading uppercase">{s.name}.</strong>{" "}
                <span className="opacity-80">{s.description}</span>
              </li>
            ))}
          </ul>
        </section>
        <Services />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
