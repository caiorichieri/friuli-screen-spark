import logo from "@/assets/logo-friuli-on.png";

export function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-8 md:py-4">
        <a href="#top" className="flex items-center" aria-label="Friuli On — home">
          <img
            src={logo}
            alt="Friuli On"
            className="h-12 w-auto md:h-16"
            width={907}
            height={349}
          />
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
