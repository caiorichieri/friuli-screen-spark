const SERVICES = [
  {
    title: "SEO",
    desc: "Posizionamento sui motori di ricerca per farti trovare dai clienti locali.",
    icon: "🔍",
    color: "bg-friuli-yellow",
  },
  {
    title: "Grafica",
    desc: "Identità visiva, loghi e materiali coordinati che raccontano il tuo brand.",
    icon: "🎨",
    color: "bg-cream border-2 border-ink",
  },
  {
    title: "Volantini",
    desc: "Stampa professionale per promozioni, eventi e campagne mirate sul territorio.",
    icon: "📄",
    color: "bg-friuli-blue text-cream",
  },
  {
    title: "Creazione Siti",
    desc: "Siti web moderni, veloci e ottimizzati per dispositivi mobili.",
    icon: "💻",
    color: "bg-cream border-2 border-ink",
  },
  {
    title: "Applicazioni",
    desc: "App su misura per la tua attività, dal gestionale al booking online.",
    icon: "📱",
    color: "bg-friuli-yellow",
  },
  {
    title: "Monitor Indoor",
    desc: "La nostra rete di TV nei luoghi più frequentati del Friuli.",
    icon: "📺",
    color: "bg-friuli-blue text-cream",
  },
];

export function Services() {
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className={`group flex flex-col justify-between rounded-3xl border-2 border-ink p-6 transition-all hover:-translate-y-2 ${s.color}`}
              style={{ boxShadow: "var(--shadow-brutal-lg)" }}
            >
              <div className="mb-8 text-5xl">{s.icon}</div>
              <div>
                <h3 className="font-heading text-2xl uppercase leading-none md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{s.desc}</p>
                <div className="mt-6 flex size-10 items-center justify-center rounded-full border-2 border-current">
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
