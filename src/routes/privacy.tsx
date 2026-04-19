import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Friuli On" },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali di Friuli On ai sensi del Regolamento UE 2016/679 (GDPR).",
      },
      { property: "og:title", content: "Privacy Policy — Friuli On" },
      {
        property: "og:description",
        content: "Informativa privacy di Friuli On secondo il GDPR.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <div className="mb-6 inline-block rounded-md bg-friuli-blue px-3 py-1 text-xs font-bold uppercase tracking-widest text-cream">
          Informativa
        </div>
        <h1 className="text-4xl uppercase leading-[0.95] md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/60">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>

        <div className="prose-friuli mt-10 space-y-8 text-base leading-relaxed text-ink/85">
          <section>
            <h2 className="font-heading text-2xl uppercase">1. Titolare del trattamento</h2>
            <p className="mt-3">
              Il Titolare del trattamento dei dati è <strong>Friuli On</strong>, con sede in
              Via Circonvallazione Sud, 80 — 33033 Codroipo (UD), Italia. P. IVA 03157410303.
              <br />
              Email:{" "}
              <a className="underline" href="mailto:info@friulion.it">
                info@friulion.it
              </a>
              {" · "}
              Tel.{" "}
              <a className="underline" href="tel:+393518230667">
                +39 351 8230667
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">2. Tipologie di dati raccolti</h2>
            <p className="mt-3">
              Raccogliamo dati personali che l'utente fornisce volontariamente compilando i
              moduli di contatto, inviando email o messaggi WhatsApp, oppure dati raccolti
              automaticamente durante la navigazione (indirizzo IP, tipo di browser, pagine
              visitate, data e ora di accesso) tramite cookie tecnici e, previo consenso,
              cookie analitici o di marketing.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">3. Finalità e base giuridica</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Rispondere a richieste di informazioni e preventivi (art. 6.1.b GDPR —
                esecuzione di misure precontrattuali).
              </li>
              <li>
                Adempimento di obblighi di legge fiscali e contabili (art. 6.1.c GDPR).
              </li>
              <li>
                Statistiche di navigazione anonime e miglioramento del sito (art. 6.1.a
                GDPR — consenso).
              </li>
              <li>
                Eventuali comunicazioni promozionali su nostri servizi (art. 6.1.a GDPR —
                consenso esplicito e revocabile).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">4. Modalità di trattamento</h2>
            <p className="mt-3">
              I dati sono trattati con strumenti elettronici e cartacei, da personale
              autorizzato e con misure tecniche e organizzative idonee a garantirne la
              sicurezza, la riservatezza e l'integrità.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">5. Conservazione dei dati</h2>
            <p className="mt-3">
              I dati di contatto sono conservati per il tempo strettamente necessario alle
              finalità per cui sono raccolti e, comunque, non oltre 24 mesi dall'ultima
              interazione, fatti salvi gli obblighi di legge (es. fatturazione: 10 anni).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">6. Comunicazione a terzi</h2>
            <p className="mt-3">
              I dati possono essere comunicati a fornitori di servizi tecnici (hosting,
              email, servizi cloud) nominati Responsabili del trattamento ex art. 28 GDPR.
              Non effettuiamo trasferimenti dei tuoi dati verso paesi extra-UE senza
              adeguate garanzie. I dati non sono diffusi né venduti.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">7. Diritti dell'interessato</h2>
            <p className="mt-3">
              Hai diritto, ai sensi degli artt. 15–22 GDPR, di accedere ai tuoi dati,
              rettificarli, cancellarli, limitarne il trattamento, opporti al trattamento e
              richiederne la portabilità. Puoi inoltre revocare in qualsiasi momento il
              consenso prestato. Per esercitare questi diritti, scrivi a{" "}
              <a className="underline" href="mailto:info@friulion.it">
                info@friulion.it
              </a>
              .
            </p>
            <p className="mt-3">
              Hai inoltre il diritto di proporre reclamo all'Autorità Garante per la
              protezione dei dati personali (
              <a
                className="underline"
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noreferrer"
              >
                www.garanteprivacy.it
              </a>
              ).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">8. Cookie</h2>
            <p className="mt-3">
              Per informazioni dettagliate sui cookie utilizzati consulta la nostra{" "}
              <Link to="/cookies" className="underline">
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl uppercase">9. Modifiche</h2>
            <p className="mt-3">
              Friuli On si riserva il diritto di aggiornare la presente informativa. Le
              modifiche saranno pubblicate su questa pagina con la data di aggiornamento.
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
