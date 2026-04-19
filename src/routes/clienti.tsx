import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { clients } from "@/data/clients";

export const Route = createFileRoute("/clienti")({
  head: () => ({
    meta: [
      { title: "Clienti — Friuli On | Le attività che hanno scelto la nostra rete" },
      {
        name: "description",
        content:
          "Scopri le attività del Friuli Venezia Giulia che hanno scelto Friuli On per la propria comunicazione: bar, farmacie, palestre e molte altre realtà locali.",
      },
      { property: "og:title", content: "Clienti — Friuli On" },
      {
        property: "og:description",
        content:
          "Le attività locali del Friuli che hanno scelto la rete di monitor indoor Friuli On.",
      },
      { rel: "canonical", href: "https://friulion.it/clienti" },
    ],
  }),
  component: ClientiPage,
});

function ClientiPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-12 pb-10 md:px-8 md:pt-16 md:pb-14">
          <p className="font-heading text-xs uppercase tracking-widest text-friuli-blue">
            La nostra community
          </p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] md:text-6xl xl:text-7xl">
            I nostri <span className="text-friuli-blue">clienti</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink/80">
            Le attività che hanno scelto Friuli On per raccontarsi sul territorio.
            Dai bar storici alle farmacie di quartiere, dalle palestre agli studi
            professionali: ogni cliente è parte della nostra rete.
          </p>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-8 md:pb-28">
          {clients.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-ink/30 bg-cream p-12 text-center">
              <p className="font-heading text-2xl uppercase">
                Stiamo caricando i nostri clienti
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
                Presto qui troverai tutte le attività che hanno scelto Friuli On.
                Vuoi essere il prossimo?
              </p>
              <Link
                to="/contatti"
                className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-friuli-yellow px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-brutal)" }}
              >
                Contattaci
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
              {clients.map((client) => {
                const card = (
                  <div
                    className="group flex h-full flex-col items-center justify-between gap-4 rounded-2xl border-2 border-ink bg-cream p-5 text-center transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                    style={{ boxShadow: "var(--shadow-brutal)" }}
                  >
                    <div className="flex h-24 w-full items-center justify-center md:h-28">
                      <img
                        src={client.logo}
                        alt={client.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-heading text-sm uppercase leading-tight">
                      {client.name}
                    </p>
                    {client.website && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-friuli-blue opacity-0 transition-opacity group-hover:opacity-100">
                        Visita il sito →
                      </span>
                    )}
                  </div>
                );

                return (
                  <li key={client.name}>
                    {client.website ? (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visita il sito di ${client.name}`}
                        className="block h-full"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* CTA finale */}
          <div className="mt-16 rounded-3xl border-2 border-ink bg-friuli-blue p-8 text-cream md:p-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl uppercase leading-tight md:text-4xl">
                  Vuoi entrare anche tu nella rete?
                </h2>
                <p className="mt-3 max-w-[55ch] text-cream/85">
                  Scopri come Friuli On può dare visibilità alla tua attività in
                  tutto il Friuli Venezia Giulia.
                </p>
              </div>
              <Link
                to="/contatti"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-friuli-yellow px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-brutal)" }}
              >
                Contattaci →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
