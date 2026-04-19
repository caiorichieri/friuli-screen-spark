import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "friulion-cookie-consent-v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

function loadConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

function saveConsent(c: Consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }

    const open = () => {
      const c = loadConsent();
      if (c) {
        setAnalytics(c.analytics);
        setMarketing(c.marketing);
      }
      setShowPrefs(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-preferences", open);
    return () => window.removeEventListener("open-cookie-preferences", open);
  }, []);

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
    setShowPrefs(false);
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
    setShowPrefs(false);
  };

  const savePrefs = () => {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
    setShowPrefs(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[100] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md"
    >
      <div
        className="rounded-2xl border-2 border-ink bg-cream p-5 text-ink md:p-6"
        style={{ boxShadow: "var(--shadow-brutal-lg)" }}
      >
        {!showPrefs ? (
          <>
            <div className="mb-2 inline-block rounded-md bg-friuli-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cream">
              🍪 Cookie
            </div>
            <h2 id="cookie-title" className="font-heading text-xl uppercase leading-tight">
              Rispettiamo la tua privacy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo tuo
              consenso, cookie di analisi e marketing. Puoi accettare, rifiutare o
              personalizzare le tue scelte. Per dettagli consulta la nostra{" "}
              <Link to="/cookies" className="font-semibold underline">
                Cookie Policy
              </Link>{" "}
              e la{" "}
              <Link to="/privacy" className="font-semibold underline">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={acceptAll}
                className="flex-1 rounded-full border-2 border-ink bg-friuli-blue px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-brutal)" }}
              >
                Accetta tutti
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 rounded-full border-2 border-ink bg-cream px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
              >
                Rifiuta
              </button>
            </div>
            <button
              onClick={() => setShowPrefs(true)}
              className="mt-3 w-full text-xs font-semibold uppercase tracking-widest text-ink/70 underline hover:text-ink"
            >
              Personalizza preferenze
            </button>
          </>
        ) : (
          <>
            <h2 className="font-heading text-xl uppercase leading-tight">
              Preferenze cookie
            </h2>
            <p className="mt-2 text-xs text-ink/70">
              Scegli quali categorie di cookie autorizzare.
            </p>

            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 rounded-xl border-2 border-ink/20 bg-cream p-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 size-4 accent-friuli-blue"
                />
                <div className="flex-1">
                  <div className="font-heading text-sm uppercase">Necessari</div>
                  <p className="text-xs text-ink/70">
                    Indispensabili al funzionamento del sito. Sempre attivi.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border-2 border-ink/20 bg-cream p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 size-4 accent-friuli-blue"
                />
                <div className="flex-1">
                  <div className="font-heading text-sm uppercase">Analitici</div>
                  <p className="text-xs text-ink/70">
                    Statistiche anonime di utilizzo per migliorare il sito.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border-2 border-ink/20 bg-cream p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 size-4 accent-friuli-blue"
                />
                <div className="flex-1">
                  <div className="font-heading text-sm uppercase">Marketing</div>
                  <p className="text-xs text-ink/70">
                    Cookie per personalizzare contenuti e annunci.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={savePrefs}
                className="flex-1 rounded-full border-2 border-ink bg-friuli-blue px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-brutal)" }}
              >
                Salva preferenze
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 rounded-full border-2 border-ink bg-friuli-yellow px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
              >
                Accetta tutti
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
