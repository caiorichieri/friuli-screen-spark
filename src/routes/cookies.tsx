import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Friuli On" },
      {
        name: "description",
        content:
          "Informativa sull'uso dei cookie del sito Friuli On ai sensi del GDPR e delle linee guida del Garante Privacy.",
      },
      { property: "og:title", content: "Cookie Policy — Friuli On" },
      {
        property: "og:description",
        content: "Cookie utilizzati dal sito Friuli On e modalità di gestione del consenso.",
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const openPrefs = () => {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <div className="mb-6 inline-block rounded-md bg-friuli-blue px-3 py-1 text-xs font-bold uppercase tracking-widest text-cream">
          🍪 Informativa Cookie
        </div>
        <h1 className="text-4xl uppercase leading-[0.95] md:text-5xl">Cookie Policy</h1>
        <p className="mt-4 text-sm text-ink/60">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-ink/85">
          <section>
            <h2 className="font-heading text-2xl uppercase">1. Cosa sono i cookie</h2>
            <p className="mt-3">
              I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano
              ai loro terminali, dove vengono memorizzati per essere ritrasmessi agli stessi
              siti alla visita successiva. Sono utilizzati per eseguire autenticazioni
              informatiche, monitoraggio di sessioni e memorizzazione di informazioni
              sull'utente.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">2. Tipologie di cookie utilizzati</h2>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border-2 border-ink bg-friuli-yellow/40 p-5">
                <h3 className="font-heading text-lg uppercase">
                  Cookie tecnici (necessari)
                </h3>
                <p className="mt-2 text-sm">
                  Indispensabili per il corretto funzionamento del sito (es. memorizzazione
                  delle preferenze di consenso ai cookie). Non richiedono il consenso
                  dell'utente. Base giuridica: art. 6.1.f GDPR (legittimo interesse).
                </p>
              </div>

              <div className="rounded-2xl border-2 border-ink bg-cream p-5">
                <h3 className="font-heading text-lg uppercase">Cookie analitici</h3>
                <p className="mt-2 text-sm">
                  Utilizzati per raccogliere informazioni aggregate e anonime sull'utilizzo
                  del sito (pagine visitate, tempo trascorso, tipo di dispositivo). Vengono
                  installati solo previo consenso esplicito.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-ink bg-cream p-5">
                <h3 className="font-heading text-lg uppercase">Cookie di marketing</h3>
                <p className="mt-2 text-sm">
                  Utilizzati per profilare l'utente e mostrare contenuti pubblicitari in
                  linea con i suoi interessi. Vengono installati solo previo consenso
                  esplicito.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">3. Gestione del consenso</h2>
            <p className="mt-3">
              Al primo accesso al sito viene mostrato un banner che consente di accettare,
              rifiutare o personalizzare i cookie non necessari. Puoi modificare le tue
              scelte in qualsiasi momento cliccando il pulsante qui sotto.
            </p>
            <button
              onClick={openPrefs}
              className="mt-4 inline-flex items-center justify-center rounded-full border-2 border-ink bg-friuli-blue px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-brutal)" }}
            >
              Gestisci preferenze cookie
            </button>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">
              4. Disabilitazione dal browser
            </h2>
            <p className="mt-3">
              Puoi disabilitare i cookie anche dalle impostazioni del tuo browser. Ti
              ricordiamo che la disabilitazione dei cookie tecnici può compromettere il
              corretto funzionamento del sito.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
              <li>
                <a
                  className="underline"
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://support.mozilla.org/it/kb/Eliminare%20i%20cookie"
                  target="_blank"
                  rel="noreferrer"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noreferrer"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://support.microsoft.com/it-it/microsoft-edge"
                  target="_blank"
                  rel="noreferrer"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">5. Titolare del trattamento</h2>
            <p className="mt-3">
              Friuli On — Via Circonvallazione Sud, 80, 33033 Codroipo (UD) — P. IVA
              03157410303. Email{" "}
              <a className="underline" href="mailto:info@friulion.it">
                info@friulion.it
              </a>
              .
            </p>
            <p className="mt-3">
              Per maggiori informazioni consulta la nostra{" "}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-friuli-yellow px-5 py-2.5 text-sm font-bold uppercase tracking-wider"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            ← Torna alla home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
