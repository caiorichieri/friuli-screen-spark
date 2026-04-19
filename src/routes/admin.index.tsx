import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, FolderKanban, ArrowRight, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUpcomingPayments, PAYMENT_LABEL, type PaymentStatus } from "@/hooks/useAdminData";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  da_pagare: "bg-friuli-yellow text-ink",
  pagato: "bg-emerald-500 text-white",
  in_ritardo: "bg-destructive text-white",
};

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [clients, services, projects, paid, due] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("payment_schedules").select("amount").eq("status", "pagato"),
        supabase.from("payment_schedules").select("amount").in("status", ["da_pagare", "in_ritardo"]),
      ]);
      const sumAmount = (rows: { amount: number }[] | null) =>
        (rows ?? []).reduce((s, r) => s + Number(r.amount), 0);
      return {
        clients: clients.count ?? 0,
        services: services.count ?? 0,
        projects: projects.count ?? 0,
        paidTotal: sumAmount(paid.data as { amount: number }[]),
        dueTotal: sumAmount(due.data as { amount: number }[]),
      };
    },
  });

  const { data: upcoming = [] } = useUpcomingPayments();

  const cards = [
    { title: "Clienti", total: stats?.clients ?? 0, icon: Users, href: "/admin/clienti", color: "bg-friuli-yellow" },
    { title: "Progetti", total: stats?.projects ?? 0, icon: FolderKanban, href: "/admin/progetti", color: "bg-friuli-blue text-cream" },
    { title: "Servizi", total: stats?.services ?? 0, icon: Briefcase, href: "/admin/servizi", color: "bg-cream" },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="font-heading text-4xl uppercase">Dashboard</h1>
        <p className="mt-2 text-ink/70">Panoramica del tuo gestionale.</p>
      </header>

      {/* Cards principali */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.href}
              className={`group block rounded-3xl border-2 border-ink p-5 transition-all hover:-translate-y-1 ${card.color}`}
              style={{ boxShadow: "var(--shadow-brutal-lg)" }}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-7 w-7" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-4 text-4xl font-bold">{card.total}</p>
              <p className="mt-1 font-heading uppercase">{card.title}</p>
            </Link>
          );
        })}
      </div>

      {/* Riepilogo finanziario */}
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="rounded-3xl border-2 border-ink bg-emerald-50 p-5"
          style={{ boxShadow: "var(--shadow-brutal)" }}
        >
          <p className="text-xs uppercase tracking-widest text-emerald-900/70">Incassato</p>
          <p className="mt-1 font-heading text-3xl text-emerald-900">
            € {(stats?.paidTotal ?? 0).toFixed(2)}
          </p>
        </div>
        <div
          className="rounded-3xl border-2 border-ink bg-amber-50 p-5"
          style={{ boxShadow: "var(--shadow-brutal)" }}
        >
          <p className="text-xs uppercase tracking-widest text-amber-900/70">Da incassare</p>
          <p className="mt-1 font-heading text-3xl text-amber-900">
            € {(stats?.dueTotal ?? 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Prossime scadenze */}
      <section
        className="rounded-3xl border-2 border-ink bg-cream p-6"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-xl uppercase">
            <Calendar className="h-5 w-5" />
            Prossime scadenze
          </h2>
          <Link to="/admin/progetti" className="text-sm text-friuli-blue hover:underline">
            Tutti i progetti →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/60">
            Nessuna scadenza in arrivo.
          </p>
        ) : (
          <ul className="divide-y-2 divide-ink/10">
            {upcoming.map((p) => {
              const overdue = p.status === "in_ritardo";
              return (
                <li key={p.id}>
                  <Link
                    to="/admin/progetti/$id"
                    params={{ id: p.projects?.id ?? "" }}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-ink/5 -mx-2 px-2 rounded"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {overdue && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
                        <Badge className={PAYMENT_COLORS[p.status]}>{PAYMENT_LABEL[p.status]}</Badge>
                        <p className="truncate text-sm font-medium">{p.projects?.title ?? "—"}</p>
                      </div>
                      <p className="mt-1 text-xs text-ink/60">
                        {p.projects?.clients?.name ?? "—"} · scadenza {new Date(p.due_date).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                    <p className="font-heading text-lg shrink-0">€ {Number(p.amount).toFixed(2)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
