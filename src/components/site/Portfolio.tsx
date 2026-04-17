const ITEMS = [
  {
    title: "Atletica 2000",
    type: "Outdoor 6x3",
    color: "bg-friuli-yellow",
  },
  {
    title: "Sbaracco Day",
    type: "Volantino · Tutto da 49,90€",
    color: "bg-friuli-blue text-cream",
  },
  {
    title: "Voci di Forza",
    type: "Evento · Comunicazione integrata",
    color: "bg-cream border-2 border-ink",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="border-t-2 border-ink bg-cream px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-block rounded-md bg-friuli-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Portfolio
            </div>
            <h2 className="text-4xl uppercase md:text-6xl">
              Trasformiamo idee <br />
              in <span className="text-friuli-blue">realtà tangibili</span>.
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink/70">
            Attenzione ai dettagli, comunicazione che parla a tutti, presente in ogni angolo della
            vita collettiva.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className={`group flex aspect-[4/5] flex-col justify-between rounded-3xl border-2 border-ink p-6 transition-all hover:-translate-y-2 ${item.color}`}
              style={{ boxShadow: "var(--shadow-brutal-lg)" }}
            >
              <div className="text-xs font-bold uppercase tracking-widest opacity-70">
                {item.type}
              </div>
              <div>
                <h3 className="font-heading text-3xl uppercase leading-none">{item.title}</h3>
                <div className="mt-4 flex size-10 items-center justify-center rounded-full border-2 border-current">
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
