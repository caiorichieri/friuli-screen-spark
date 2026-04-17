export function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <div
            className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-friuli-yellow"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            <span className="font-heading text-2xl leading-none">!</span>
          </div>
          <span className="font-heading text-lg uppercase tracking-tight md:text-xl">
            Friuli On
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-widest md:flex">
          <button onClick={() => scrollTo("circuito")} className="hover:text-friuli-blue">
            Il Circuito
          </button>
          <button onClick={() => scrollTo("chi-siamo")} className="hover:text-friuli-blue">
            Chi Siamo
          </button>
          <button onClick={() => scrollTo("portfolio")} className="hover:text-friuli-blue">
            Portfolio
          </button>
          <button
            onClick={() => scrollTo("contatti")}
            className="rounded-full border-2 border-ink bg-friuli-blue px-5 py-2.5 text-cream uppercase transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            Contattaci
          </button>
        </div>

        <button
          onClick={() => scrollTo("contatti")}
          className="rounded-full border-2 border-ink bg-friuli-blue px-4 py-2 text-xs font-bold uppercase text-cream md:hidden"
        >
          Contatti
        </button>
      </div>
    </nav>
  );
}
