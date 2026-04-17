import logo from "@/assets/logo-friuli-on.png";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink px-6 py-12 text-cream md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-cream px-4 py-3">
            <img
              src={logo}
              alt="Friuli On"
              className="h-10 w-auto md:h-12"
              width={240}
              height={80}
            />
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cream/60">
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
