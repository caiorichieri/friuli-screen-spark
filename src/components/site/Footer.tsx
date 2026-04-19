import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-friuli-on-text.png";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink px-6 py-14 text-cream md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <img
              src={logo}
              alt="Friuli On"
              className="h-14 w-auto md:h-16"
              width={907}
              height={349}
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Pubblicità locale, monitor indoor e comunicazione integrata nel cuore del
              Friuli Venezia Giulia.
            </p>
          </div>

          {/* Contatti */}
          <div className="md:col-span-4">
            <h3 className="font-heading text-sm uppercase tracking-widest text-friuli-yellow">
              Contatti
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:info@friulion.it"
                  className="text-cream/80 transition-colors hover:text-friuli-yellow"
                >
                  info@friulion.it
                </a>
              </li>
              <li>
                <a
                  href="tel:+393518230667"
                  className="text-cream/80 transition-colors hover:text-friuli-yellow"
                >
                  Tel. +39 351 8230667
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/393518230667?text=Ciao!%20Vorrei%20informazioni%20sui%20servizi%20di%20Friuli%20On."
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/80 transition-colors hover:text-friuli-yellow"
                >
                  WhatsApp +39 351 8230667
                </a>
              </li>
            </ul>
          </div>

          {/* Sede + Legale */}
          <div className="md:col-span-4">
            <h3 className="font-heading text-sm uppercase tracking-widest text-friuli-yellow">
              Sede
            </h3>
            <address className="mt-4 not-italic text-sm leading-relaxed text-cream/80">
              Friuli On<br />
              Via Circonvallazione Sud, 80<br />
              33033 Codroipo (UD)<br />
              P. IVA 03157410303
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-6 text-xs text-cream/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Friuli On · Tutti i diritti riservati</div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-friuli-yellow">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="transition-colors hover:text-friuli-yellow">
              Cookie Policy
            </Link>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
              }}
              className="transition-colors hover:text-friuli-yellow"
            >
              Preferenze cookie
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
