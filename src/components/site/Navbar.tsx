import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-friuli-on.png";

const NAV_ITEMS = [
  { to: "/circuito", label: "Il Circuito" },
  { to: "/servizi", label: "Servizi" },
  { to: "/chi-siamo", label: "Chi Siamo" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/clienti", label: "Clienti" },
] as const;

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-8 md:py-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Friuli On — home">
          <img
            src={logo}
            alt="Friuli On"
            className="h-12 w-auto lg:h-16"
            width={907}
            height={349}
          />
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-widest lg:flex xl:gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-friuli-blue"
              activeProps={{ className: "text-friuli-blue" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contatti"
            className="rounded-full border-2 border-ink bg-friuli-blue px-5 py-2.5 text-cream uppercase transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            Contattaci
          </Link>
        </div>

        <Link
          to="/contatti"
          className="shrink-0 rounded-full border-2 border-ink bg-friuli-blue px-4 py-2 text-xs font-bold uppercase text-cream lg:hidden"
        >
          Contatti
        </Link>
      </div>
    </nav>
  );
}
