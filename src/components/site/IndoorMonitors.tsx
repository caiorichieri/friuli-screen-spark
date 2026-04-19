import locBar from "@/assets/loc-bar.jpg";
import locPharmacy from "@/assets/loc-pharmacy.jpg";
import locGym from "@/assets/loc-gym.jpg";

const CITIES = [
  "Codroipo",
  "Bertiolo",
  "Camino al Tagliamento",
  "Varmo",
  "Madrisio di Varmo",
  "Basiliano",
  "Lignano Sabbiadoro",
  "Campoformido",
  "Romans d'Isonzo",
  "Pasian di Prato",
  "Casarsa della Delizia",
];

const CATEGORIES = [
  {
    title: "Bar & Caffè",
    image: locBar,
    count: "Punti chiave",
    description:
      "Il rito del caffè è sacro. I nostri monitor accompagnano la colazione, la pausa pranzo e l'aperitivo dei friulani — momenti di alta frequenza e attenzione.",
    tags: ["Alta visibilità", "Target locale"],
  },
  {
    title: "Farmacie & Salute",
    image: locPharmacy,
    count: "Tempo d'attesa qualificato",
    description:
      "Dove l'attesa diventa attenzione. Farmacie e studi sono il contesto perfetto per messaggi istituzionali, promozioni e comunicazione di servizio.",
    tags: ["Fiducia", "Lungo dwell time"],
  },
  {
    title: "Palestre & Tempo libero",
    image: locGym,
    count: "Pubblico dinamico",
    description:
      "Centri sportivi e luoghi di socialità per intercettare un pubblico giovane, attivo e attento alle novità del territorio.",
    tags: ["Dinamismo", "Target attivo"],
  },
];

export function IndoorMonitors() {
  return (
    <section id="circuito" className="border-y-2 border-ink bg-friuli-blue px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 inline-block rounded-md bg-friuli-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">
              Il Nostro Network
            </div>
            <h2 className="mb-6 text-4xl uppercase text-cream md:text-6xl">
              Monitor indoor dove la gente <span className="text-friuli-yellow">si incontra</span>.
            </h2>
            <p className="text-lg leading-relaxed text-cream/80 md:text-xl">
              Una rete di schermi TV posizionati nei punti più frequentati del Friuli. Niente distrazioni, solo
              attenzione reale, in contesti di vita quotidiana.
            </p>
          </div>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <article
              key={cat.title}
              className="group rounded-2xl border-2 border-ink bg-cream p-2 transition-all hover:-translate-y-2"
              style={{ boxShadow: "var(--shadow-brutal-lg)" }}
            >
              <div className="mb-5 overflow-hidden rounded-xl border-2 border-ink">
                <img
                  src={cat.image}
                  alt={cat.title}
                  width={960}
                  height={720}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-4 pb-6">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-xl uppercase">{cat.title}</h3>
                  <span className="shrink-0 rounded border border-ink bg-friuli-yellow px-2 py-1 text-[10px] font-bold uppercase">
                    {cat.count}
                  </span>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-ink/70">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((tag) => (
                    <span key={tag} className="rounded border border-ink/20 px-2 py-1 text-[10px] font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Cities */}
        <div className="rounded-3xl border-2 border-cream/30 p-8 md:p-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl uppercase text-cream md:text-3xl">
                Presenti in <span className="text-friuli-yellow">11 comuni</span> del Friuli
              </h3>
              <p className="mt-2 text-cream/70">Dalle località balneari ai paesi della pianura friulana.</p>
            </div>
            <a
              href="#contatti"
              className="inline-flex items-center justify-center self-start border-2 border-ink bg-friuli-yellow px-6 py-3 font-heading text-sm uppercase tracking-tight md:self-auto"
              style={{ boxShadow: "var(--shadow-brutal)" }}
            >
              Vuoi un monitor da te?
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {CITIES.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-2 rounded-full border-2 border-cream/30 bg-friuli-blue px-4 py-2 text-sm font-semibold text-cream transition-colors hover:border-friuli-yellow hover:text-friuli-yellow"
              >
                <span className="size-1.5 rounded-full bg-friuli-yellow" />
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-y border-cream/20 py-12 md:grid-cols-4">
          {[
            { v: "11", l: "Comuni coperti" },
            { v: "32", l: "Annuncianti" },
            { v: "24/7", l: "Sempre on air" },
            { v: "100%", l: "Territorio FVG" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-heading text-4xl tracking-tighter text-friuli-yellow md:text-5xl">{s.v}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-cream/60 md:text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
