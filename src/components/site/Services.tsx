import { usePublicServices } from "@/hooks/usePublicData";

const FALLBACK_SERVICES = [
  {
    id: "f-seo",
    title: "SEO",
    description: "Posizionamento sui motori di ricerca per farti trovare dai clienti locali.",
    icon: "🔍",
  },
  {
    id: "f-grafica",
    title: "Grafica",
    description: "Identità visiva, loghi e materiali coordinati che raccontano il tuo brand.",
    icon: "🎨",
  },
  {
    id: "f-volantini",
    title: "Volantini",
    description: "Stampa professionale per promozioni, eventi e campagne mirate sul territorio.",
    icon: "📄",
  },
  {
    id: "f-siti",
    title: "Creazione Siti",
    description: "Siti web moderni, veloci e ottimizzati per dispositivi mobili.",
    icon: "💻",
  },
  {
    id: "f-app",
    title: "Applicazioni",
    description: "App su misura per la tua attività, dal gestionale al booking online.",
    icon: "📱",
  },
  {
    id: "f-monitor",
    title: "Monitor Indoor",
    description: "La nostra rete di TV nei luoghi più frequentati del Friuli.",
    icon: "📺",
  },
];

const COLORS = [
  "bg-friuli-yellow",
  "bg-cream border-2 border-ink",
  "bg-friuli-blue text-cream",
  "bg-cream border-2 border-ink",
  "bg-friuli-yellow",
  "bg-friuli-blue text-cream",
];

export function Services() {
  const { data: dbServices = [], isLoading } = usePublicServices();

  const services =
    dbServices.length > 0
      ? dbServices.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description ?? "",
          icon: s.icon || "✨",
        }))
      : FALLBACK_SERVICES;

  return (
    <section
      id="servizi"
      className="border-t-2 border-ink bg-cream px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-block rounded-md bg-friuli-blue px-3 py-1 text-xs font-bold uppercase tracking-widest text-cream">
              I Nostri Servizi
            </div>
            <h2 className="text-4xl uppercase leading-[0.95] md:text-6xl">
              Una soluzione <span className="text-friuli-blue">completa</span>
              <br /> per la tua comunicazione.
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink/70">
            Non solo monitor indoor: ti accompagniamo in ogni fase della tua presenza locale,
            online e offline.
          </p>
        </div>

        {isLoading && dbServices.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl border-2 border-ink/20 bg-ink/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <div
                key={s.id}
                className={`group flex flex-col justify-between rounded-3xl border-2 border-ink p-6 transition-all hover:-translate-y-2 ${COLORS[idx % COLORS.length]}`}
                style={{ boxShadow: "var(--shadow-brutal-lg)" }}
              >
                <div className="mb-8 text-5xl">{s.icon}</div>
                <div>
                  <h3 className="font-heading text-2xl uppercase leading-none md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-80">{s.description}</p>
                  <div className="mt-6 flex size-10 items-center justify-center rounded-full border-2 border-current">
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
