import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/logo-friuli-on.png";

export function Navbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const goToSection = (id: string) => {
    if (pathname !== "/") {
      navigate({ to: "/", hash: id });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-8 md:py-4">
        <Link to="/" className="flex items-center" aria-label="Friuli On — home">
          <img
            src={logo}
            alt="Friuli On"
            className="h-12 w-auto md:h-16"
            width={907}
            height={349}
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-widest md:flex">
          <button onClick={() => goToSection("circuito")} className="hover:text-friuli-blue">
            Il Circuito
          </button>
          <button onClick={() => goToSection("chi-siamo")} className="hover:text-friuli-blue">
            Chi Siamo
          </button>
          <button onClick={() => goToSection("portfolio")} className="hover:text-friuli-blue">
            Portfolio
          </button>
          <a
            href="https://wa.me/393518230667?text=Ciao!%20Vorrei%20informazioni%20su%20Friuli%20On."
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-ink bg-friuli-blue px-5 py-2.5 text-cream uppercase transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            Contattaci
          </a>
        </div>

        <a
          href="https://wa.me/393518230667?text=Ciao!%20Vorrei%20informazioni%20su%20Friuli%20On."
          target="_blank"
          rel="noreferrer"
          className="rounded-full border-2 border-ink bg-friuli-blue px-4 py-2 text-xs font-bold uppercase text-cream md:hidden"
        >
          Contatti
        </a>
      </div>
    </nav>
  );
}
