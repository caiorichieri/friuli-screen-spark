import logo from "@/assets/logo-friuli-on.png";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink px-6 py-12 text-cream md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-6">
          <img
            src={logo}
            alt="Friuli On"
            className="h-12 w-auto md:h-16"
            width={907}
            height={349}
          />
          <div className="hidden text-[10px] uppercase tracking-[0.3em] text-cream/60 sm:block">
            Indoor TV · Friuli<br />Venezia Giulia
          </div>
        </div>
        <div className="text-xs text-cream/50">
          © {new Date().getFullYear()} Friuli On · Codroipo (UD)
        </div>
      </div>
    </footer>
  );
}
