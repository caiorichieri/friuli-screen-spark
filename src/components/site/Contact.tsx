export function Contact() {
  return (
    <section id="contatti" className="border-t-2 border-ink bg-friuli-yellow px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-block rounded-md border-2 border-ink bg-cream px-3 py-1 text-xs font-bold uppercase tracking-widest">
          💡 Contatti
        </div>
        <h2 className="mb-6 text-4xl uppercase leading-[0.95] md:text-6xl">
          Il tuo messaggio è <br className="hidden md:block" />
          <span className="text-friuli-blue">importante</span> per noi.
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-ink/80 md:text-xl">
          Hai domande, curiosità o un progetto da proporci? Crediamo nel dialogo diretto,
          nell'ascolto attento e nella costruzione di connessioni autentiche.
        </p>

        <div className="mx-auto mb-10 grid max-w-3xl gap-4 md:grid-cols-3">
          <a
            href="mailto:info@friulion.it"
            className="rounded-2xl border-2 border-ink bg-cream p-6 text-left transition-all hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/60">
              Email
            </div>
            <div className="font-heading text-base uppercase">info@friulion.it</div>
          </a>
          <a
            href="tel:+393518230667"
            className="rounded-2xl border-2 border-ink bg-cream p-6 text-left transition-all hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/60">
              Telefono
            </div>
            <div className="font-heading text-base uppercase">+39 351 8230667</div>
          </a>
          <a
            href="https://wa.me/393518230667?text=Ciao!%20Vorrei%20informazioni%20sui%20monitor%20indoor%20di%20Friuli%20On."
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border-2 border-ink bg-friuli-blue p-6 text-left text-cream transition-all hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-cream/70">
              WhatsApp
            </div>
            <div className="font-heading text-base uppercase">Scrivici subito</div>
          </a>
        </div>

        <div className="text-sm text-ink/70">
          Via Circonvallazione Sud, 80 · 33033 Codroipo (UD)
        </div>
      </div>
    </section>
  );
}
