import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Briefcase, LogOut, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Pannello admin — Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-ink/60">Caricamento...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div
          className="max-w-md rounded-3xl border-2 border-ink bg-cream p-8 text-center"
          style={{ boxShadow: "var(--shadow-brutal-lg)" }}
        >
          <h1 className="font-heading text-3xl uppercase">Accesso negato</h1>
          <p className="mt-3 text-ink/70">
            Il tuo account non ha i permessi per accedere al pannello admin.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link to="/">Torna al sito</Link>
            </Button>
            <Button onClick={() => void signOut()} variant="ghost">
              Esci
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/clienti", label: "Clienti", icon: Users },
    { to: "/admin/servizi", label: "Servizi", icon: Briefcase },
  ] as const;

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r-2 border-ink bg-cream md:block">
        <div className="sticky top-0 flex h-screen flex-col p-6">
          <Link to="/" className="mb-8 font-heading text-2xl uppercase">
            Friuli <span className="text-friuli-blue">On</span>
          </Link>
          <p className="mb-6 text-xs uppercase tracking-widest text-ink/50">Admin</p>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-friuli-blue text-cream"
                      : "text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t-2 border-ink pt-4">
            <p className="truncate px-3 text-xs text-ink/60">{user.email}</p>
            <Button asChild variant="ghost" size="sm" className="w-full justify-start">
              <Link to="/">
                <Home className="h-4 w-4" />
                Vedi sito
              </Link>
            </Button>
            <Button
              onClick={() => void signOut()}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Esci
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 border-b-2 border-ink bg-cream px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-heading text-lg uppercase">
          Friuli <span className="text-friuli-blue">On</span> Admin
        </Link>
        <Button onClick={() => void signOut()} variant="ghost" size="sm">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t-2 border-ink bg-cream flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-4 py-1 text-xs ${
                isActive ? "text-friuli-blue font-bold" : "text-ink/60"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 md:p-8 p-4 pt-16 pb-24 md:pt-8 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
