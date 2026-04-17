export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink px-6 py-12 text-cream md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-cream bg-friuli-yellow">
            <span className="font-heading text-xl text-ink">!</span>
          </div>
          <div>
            <div className="font-heading text-base uppercase">Friuli On</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
              Indoor TV · Friuli Venezia Giulia
            </div>
          </div>
        </div>
        <div className="text-xs text-cream/50">
          © {new Date().getFullYear()} Friuli On · Codroipo (UD)
        </div>
      </div>
    </footer>
  );
}
