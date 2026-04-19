import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectStatus = "richiesto" | "in_corso" | "completato" | "archiviato";
export type PaymentStatus = "da_pagare" | "pagato" | "in_ritardo";

export type Project = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  flat_amount: number | null;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectWithClient = Project & {
  clients: { id: string; name: string } | null;
};

export type ProjectItem = {
  id: string;
  project_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
};

export type PaymentSchedule = {
  id: string;
  project_id: string;
  amount: number;
  due_date: string;
  status: PaymentStatus;
  paid_at: string | null;
  notes: string | null;
};

export type PaymentWithProject = PaymentSchedule & {
  projects: { id: string; title: string; clients: { name: string } | null } | null;
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  richiesto: "Richiesto",
  in_corso: "In corso",
  completato: "Completato",
  archiviato: "Archiviato",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  da_pagare: "Da pagare",
  pagato: "Pagato",
  in_ritardo: "In ritardo",
};

// ---------- Projects ----------
export function useProjects(filters?: { status?: ProjectStatus; clientId?: string }) {
  return useQuery({
    queryKey: ["admin", "projects", filters],
    queryFn: async () => {
      let q = supabase
        .from("projects")
        .select("*, clients(id, name)")
        .order("created_at", { ascending: false });
      if (filters?.status) q = q.eq("status", filters.status);
      if (filters?.clientId) q = q.eq("client_id", filters.clientId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ProjectWithClient[];
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["admin", "project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(id, name, email)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Project & { clients: { id: string; name: string; email: string | null } | null };
    },
  });
}

export function useProjectItems(projectId: string) {
  return useQuery({
    queryKey: ["admin", "project-items", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_items")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ProjectItem[];
    },
  });
}

export function usePayments(projectId: string) {
  return useQuery({
    queryKey: ["admin", "payments", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_schedules")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PaymentSchedule[];
    },
  });
}

// All upcoming payments across projects (for dashboard)
export function useUpcomingPayments() {
  return useQuery({
    queryKey: ["admin", "upcoming-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_schedules")
        .select("*, projects(id, title, clients(name))")
        .in("status", ["da_pagare", "in_ritardo"])
        .order("due_date", { ascending: true })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as PaymentWithProject[];
    },
  });
}

// ---------- Mutations ----------
export function useInvalidateProjects() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    void qc.invalidateQueries({ queryKey: ["admin", "upcoming-payments"] });
    void qc.invalidateQueries({ queryKey: ["admin", "stats"] });
  };
}

export function useDeleteProject() {
  const invalidate = useInvalidateProjects();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Progetto eliminato");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useTogglePaymentPaid(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const update: { status: PaymentStatus; paid_at: string | null } = {
        status,
        paid_at: status === "pagato" ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from("payment_schedules").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "payments", projectId] });
      void qc.invalidateQueries({ queryKey: ["admin", "upcoming-payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// Helper: total of a project (items sum + flat_amount)
export function calcProjectTotal(items: ProjectItem[], flat: number | null): number {
  const itemsTotal = items.reduce((s, it) => s + Number(it.quantity) * Number(it.unit_price), 0);
  return itemsTotal + Number(flat ?? 0);
}
