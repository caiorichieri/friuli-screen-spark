import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useManagedClients } from "@/hooks/useClientLanding";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, LogOut, Home } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Area cliente — Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ClientDashboard,
});

function ClientDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { data: clients = [], isLoading } = useManagedClients();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    if (isAdmin) {
      void navigate({ to: "/admin" });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-ink/60">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b-2 border-ink bg-cream px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="font-heading text-2xl uppercase">
            Friuli <span className="text-friuli-blue">On</span>
          </Link>
          <div className="flex items-center gap-2">
            <p className="hidden text-xs text-ink/60 sm:block">{user.email}</p>
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <Home className="h-4 w-4" /> Sito
              </Link>
            </Button>
            <Button onClick={() => void signOut()} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-heading text-4xl uppercase">La tua area</h1>
        <p className="mt-2 text-ink/70">Gestisci le landing page dei tuoi clienti.</p>

        {isLoading ? (
          <p className="mt-8 text-ink/60">Caricamento...</p>
        ) : clients.length === 0 ? (
          <div
            className="mt-8 rounded-3xl border-2 border-dashed border-ink/30 bg-cream p-12 text-center"
          >
            <p className="font-heading text-xl uppercase">Nessuna landing assegnata</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
              Non hai ancora il permesso di gestire nessuna landing page. Contatta l'amministratore di Friuli On.
            </p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <li
                key={c.id}
                className="flex flex-col rounded-2xl border-2 border-ink bg-cream p-4"
                style={{ boxShadow: "var(--shadow-brutal)" }}
              >
                <div className="flex h-24 items-center justify-center rounded-lg bg-white p-3">
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      alt={c.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="font-heading text-2xl text-ink/40">
                      {c.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="mt-3 font-heading text-lg uppercase leading-tight">{c.name}</p>
                <p className="mt-1 text-xs text-ink/60">/{c.slug}</p>
                <div className="mt-4 flex gap-2 border-t-2 border-ink pt-3">
                  <Button asChild size="sm" className="flex-1 bg-friuli-blue text-cream hover:bg-friuli-blue/90">
                    <Link to="/landing/$clientId" params={{ clientId: c.id }}>
                      <Pencil className="h-4 w-4" /> Modifica
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href={`/${c.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
