import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [clients, services, publicClients, publicServices] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("clients").select("*", { count: "exact", head: true }).eq("is_public", true),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("is_public", true),
      ]);
      return {
        clients: clients.count ?? 0,
        services: services.count ?? 0,
        publicClients: publicClients.count ?? 0,
        publicServices: publicServices.count ?? 0,
      };
    },
  });

  const cards = [
    {
      title: "Clienti",
      total: stats?.clients ?? 0,
      visible: stats?.publicClients ?? 0,
      icon: Users,
      href: "/admin/clienti",
      color: "bg-friuli-yellow",
    },
    {
      title: "Servizi",
      total: stats?.services ?? 0,
      visible: stats?.publicServices ?? 0,
      icon: Briefcase,
      href: "/admin/servizi",
      color: "bg-friuli-blue text-cream",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-heading text-4xl uppercase">Dashboard</h1>
        <p className="mt-2 text-ink/70">Panoramica del tuo pannello.</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.href}
              className={`group block rounded-3xl border-2 border-ink p-6 transition-all hover:-translate-y-1 ${card.color}`}
              style={{ boxShadow: "var(--shadow-brutal-lg)" }}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8" />
                <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-6 text-5xl font-bold">{card.total}</p>
              <p className="mt-1 font-heading uppercase">{card.title}</p>
              <p className="mt-2 text-sm opacity-80">
                {card.visible} visibili sul sito
              </p>
            </Link>
          );
        })}
      </div>

      <div
        className="mt-10 rounded-3xl border-2 border-ink bg-cream p-6"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <h2 className="font-heading text-xl uppercase">Prossimi passi</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink/80">
          <li>📌 Aggiungi i tuoi <Link to="/admin/clienti" className="text-friuli-blue underline">clienti</Link> con logo, nome e link.</li>
          <li>📌 Personalizza i <Link to="/admin/servizi" className="text-friuli-blue underline">servizi</Link> mostrati sul sito.</li>
          <li>🚀 Fase 2 in arrivo: gestionale interno per preventivi, scadenze pagamenti e stato lavori.</li>
        </ul>
      </div>
    </div>
  );
}
