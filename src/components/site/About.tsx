export function About() {
  return (
    <section id="chi-siamo" className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="mb-6 inline-block rounded-md bg-friuli-blue px-3 py-1 text-xs font-bold uppercase tracking-widest text-cream">
            Chi Siamo
          </div>
          <h2 className="text-4xl uppercase leading-[0.95] md:text-6xl">
            Il punto d'incontro tra <span className="text-friuli-blue">tradizione</span>, innovazione e{" "}
            <span className="text-friuli-blue">comunità</span>.
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-7">
          <p>
            Friuli On nasce per rendere la pubblicità locale più accessibile, efficace e sostenibile. Connettiamo
            imprese e comunità in modo diretto, moderno e profondamente territoriale.
          </p>
          <p>
            Guardiamo oltre il dolce. Una mano che stringe un pirulito può sembrare un gesto quotidiano, ma per noi ogni
            dettaglio racconta una storia, comunica un'idea, evoca un'emozione. Esploriamo, interpretiamo, creiamo.{" "}
            <strong>Insieme.</strong>
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { k: "Locale", v: "100%" },
              { k: "Indoor", v: "MONITOR" },
              { k: "Costo", v: "Basso" },
            ].map((b) => (
              <div
                key={b.k}
                className="rounded-2xl border-2 border-ink bg-friuli-yellow p-4 text-center"
                style={{ boxShadow: "var(--shadow-brutal)" }}
              >
                <div className="font-heading text-2xl">{b.v}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest">{b.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
