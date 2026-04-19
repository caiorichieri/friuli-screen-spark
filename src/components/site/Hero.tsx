import heroBar from "@/assets/hero-bar.jpg";

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto max-w-7xl overflow-hidden px-6 pt-12 pb-20 md:px-8 md:pt-16 md:pb-28"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <div className="mb-6 inline-block -rotate-2 rounded-md bg-friuli-blue px-4 py-1 font-bold uppercase tracking-tight text-cream">
            Novità · Circuito Indoor
          </div>
          <h1 className="mb-8 text-5xl uppercase leading-[0.9] md:text-7xl xl:text-8xl">
            La tua voce nel <span className="text-friuli-blue">cuore</span> del Friuli.
          </h1>
          <p className="mb-10 max-w-[48ch] text-lg leading-relaxed text-ink/80 md:text-xl">
            Friuli On rende la pubblicità locale accessibile, efficace e sostenibile. Una rete di
            <strong> monitor TV indoor</strong> nei luoghi più frequentati del Friuli Venezia
            Giulia, per dare visibilità alle attività del territorio.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#circuito"
              className="inline-flex items-center justify-center border-2 border-ink bg-friuli-yellow px-8 py-4 font-heading text-base uppercase tracking-tight transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 md:text-lg"
              style={{ boxShadow: "var(--shadow-brutal-lg)" }}
            >
              Scopri il Circuito
            </a>
            <a
              href="https://wa.me/393518230667?text=Ciao!%20Vorrei%20informazioni%20su%20Friuli%20On."
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3"
            >
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-ink transition-colors group-hover:bg-friuli-yellow">
                <span className="font-bold">→</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider">
                Parla con noi
              </span>
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div
            className="relative rotate-2 overflow-hidden rounded-3xl border-4 border-ink"
            style={{ boxShadow: "var(--shadow-brutal-2xl)" }}
          >
            <img
              src={heroBar}
              alt="Monitor indoor in un bar tradizionale del Friuli"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6">
              <div className="rounded-xl border-2 border-ink bg-cream p-3">
                <p className="font-heading text-xs uppercase">In onda ora</p>
                <p className="font-body text-xs text-ink/70">
                  Informazione e Pubblicità
                </p>
              </div>
            </div>
          </div>
          <div
            className="absolute -top-6 -right-4 flex size-32 -rotate-12 flex-col items-center justify-center rounded-full border-2 border-ink bg-friuli-yellow shadow-lg md:-right-6"
          >
            <span className="font-heading text-3xl leading-none">+11</span>
            <span className="px-2 text-center text-[10px] font-bold uppercase leading-tight tracking-widest">
              Comuni Coperti
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
