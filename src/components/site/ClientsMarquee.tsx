import { Link } from "@tanstack/react-router";
import { clients } from "@/data/clients";

/**
 * Fascia orizzontale animata con i loghi dei clienti.
 * Se non ci sono clienti caricati, mostra un placeholder discreto.
 */
export function ClientsMarquee() {
  const hasClients = clients.length > 0;

  // Duplichiamo la lista per ottenere uno scroll infinito senza salti
  const loop = hasClients ? [...clients, ...clients] : [];

  return (
    <section
      aria-labelledby="clienti-heading"
      className="border-y-2 border-ink bg-cream py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-heading text-xs uppercase tracking-widest text-friuli-blue">
              Loro hanno scelto Friuli On
            </p>
            <h2
              id="clienti-heading"
              className="mt-2 text-3xl uppercase leading-tight md:text-4xl"
            >
              I nostri clienti
            </h2>
          </div>
          <Link
            to="/clienti"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-friuli-yellow px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            Vedi tutti →
          </Link>
        </div>
      </div>

      {hasClients ? (
        <div
          className="group relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused] md:gap-16">
            {loop.map((client, idx) => {
              const inner = (
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-full max-w-[160px] object-contain opacity-80 transition-opacity hover:opacity-100 md:max-w-[200px]"
                />
              );
              return (
                <div
                  key={`${client.name}-${idx}`}
                  className="flex h-20 shrink-0 items-center justify-center md:h-24"
                  title={client.name}
                >
                  {client.website ? (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visita il sito di ${client.name}`}
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="rounded-2xl border-2 border-dashed border-ink/30 bg-cream p-8 text-center text-sm text-ink/60">
            Stiamo aggiungendo i nostri clienti. Torna a trovarci presto!
          </div>
        </div>
      )}
    </section>
  );
}
