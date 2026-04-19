import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useProject,
  useProjectItems,
  usePayments,
  useTogglePaymentPaid,
  calcProjectTotal,
  usePortfolioCategoriesAdmin,
  STATUS_LABEL,
  PAYMENT_LABEL,
  type ProjectStatus,
  type PaymentStatus,
  type ProjectItem,
  type PaymentSchedule,
} from "@/hooks/useAdminData";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  Calendar,
  Euro,
  CheckCircle2,
  Clock,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/admin/progetti/$id")({
  head: () => ({
    meta: [
      { title: "Dettaglio progetto — Admin Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProjectDetailPage,
});

const STATUS_COLORS: Record<ProjectStatus, string> = {
  richiesto: "bg-friuli-yellow text-ink",
  in_corso: "bg-friuli-blue text-cream",
  completato: "bg-emerald-500 text-white",
  archiviato: "bg-ink/20 text-ink",
};

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  da_pagare: "bg-friuli-yellow text-ink",
  pagato: "bg-emerald-500 text-white",
  in_ritardo: "bg-destructive text-white",
};

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: project, isLoading } = useProject(id);
  const { data: items = [] } = useProjectItems(id);
  const { data: payments = [] } = usePayments(id);

  const [itemDialog, setItemDialog] = useState<{ open: boolean; editing: ProjectItem | null }>({
    open: false,
    editing: null,
  });
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; editing: PaymentSchedule | null }>({
    open: false,
    editing: null,
  });

  const updateStatus = useMutation({
    mutationFn: async (newStatus: ProjectStatus) => {
      const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "project", id] });
      void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      toast.success("Stato aggiornato");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("project_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "project-items", id] });
      toast.success("Voce eliminata");
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (pid: string) => {
      const { error } = await supabase.from("payment_schedules").delete().eq("id", pid);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "payments", id] });
      void qc.invalidateQueries({ queryKey: ["admin", "upcoming-payments"] });
      toast.success("Scadenza eliminata");
    },
  });

  const togglePaid = useTogglePaymentPaid(id);

  if (isLoading) return <p className="text-ink/60">Caricamento...</p>;
  if (!project) return <p>Progetto non trovato.</p>;

  const projectTotal = calcProjectTotal(items, project.flat_amount);
  const paidTotal = payments.filter((p) => p.status === "pagato").reduce((s, p) => s + Number(p.amount), 0);
  const dueTotal = payments.filter((p) => p.status !== "pagato").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/admin/progetti">
          <ArrowLeft className="h-4 w-4" />
          Tutti i progetti
        </Link>
      </Button>

      {/* Header progetto */}
      <header
        className="rounded-3xl border-2 border-ink bg-cream p-6"
        style={{ boxShadow: "var(--shadow-brutal-lg)" }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink/60">Cliente</p>
            <p className="font-medium">{project.clients?.name ?? "—"}</p>
            <h1 className="mt-2 font-heading text-3xl uppercase">{project.title}</h1>
            {project.description && (
              <p className="mt-2 text-ink/70">{project.description}</p>
            )}
          </div>
          <div className="w-full sm:w-48">
            <Label className="text-xs uppercase">Stato</Label>
            <Select
              value={project.status}
              onValueChange={(v) => updateStatus.mutate(v as ProjectStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    <Badge className={STATUS_COLORS[s]}>{STATUS_LABEL[s]}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Totali */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t-2 border-ink pt-4">
          <Stat label="Totale" value={projectTotal} icon={Euro} />
          <Stat label="Incassato" value={paidTotal} icon={CheckCircle2} accent="text-emerald-700" />
          <Stat label="Da incassare" value={dueTotal} icon={Clock} accent="text-friuli-blue" />
        </div>
      </header>

      {/* Voci */}
      <section
        className="rounded-3xl border-2 border-ink bg-cream p-6"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl uppercase">Voci dettagliate</h2>
          <Button
            size="sm"
            onClick={() => setItemDialog({ open: true, editing: null })}
            className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
          >
            <Plus className="h-4 w-4" />
            Aggiungi voce
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/60">
            Nessuna voce. Aggiungile per costruire il preventivo, oppure usa l'importo flat.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink text-left">
                  <th className="py-2">Descrizione</th>
                  <th className="py-2 text-right">Q.tà</th>
                  <th className="py-2 text-right">Prezzo</th>
                  <th className="py-2 text-right">Totale</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-b border-ink/10">
                    <td className="py-2">{it.description}</td>
                    <td className="py-2 text-right">{Number(it.quantity)}</td>
                    <td className="py-2 text-right">€ {Number(it.unit_price).toFixed(2)}</td>
                    <td className="py-2 text-right font-medium">
                      € {(Number(it.quantity) * Number(it.unit_price)).toFixed(2)}
                    </td>
                    <td className="py-2 text-right">
                      <Button size="icon" variant="ghost" onClick={() => setItemDialog({ open: true, editing: it })}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteItem.mutate(it.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Importo flat opzionale */}
        <FlatAmountEditor
          projectId={id}
          currentAmount={project.flat_amount}
        />
      </section>

      {/* Scadenze pagamento */}
      <section
        className="rounded-3xl border-2 border-ink bg-cream p-6"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl uppercase">Scadenze pagamento</h2>
          <Button
            size="sm"
            onClick={() => setPaymentDialog({ open: true, editing: null })}
            className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
          >
            <Plus className="h-4 w-4" />
            Nuova scadenza
          </Button>
        </div>

        {payments.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/60">
            Nessuna scadenza. Aggiungi una rata o un pagamento unico.
          </p>
        ) : (
          <ul className="space-y-2">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 rounded-xl border-2 border-ink bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge className={PAYMENT_COLORS[p.status]}>
                    {PAYMENT_LABEL[p.status]}
                  </Badge>
                  <div>
                    <p className="font-medium">€ {Number(p.amount).toFixed(2)}</p>
                    <p className="text-xs text-ink/60 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Scadenza: {new Date(p.due_date).toLocaleDateString("it-IT")}
                    </p>
                    {p.notes && <p className="text-xs text-ink/60">{p.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Select
                    value={p.status}
                    onValueChange={(v) => togglePaid.mutate({ id: p.id, status: v as PaymentStatus })}
                  >
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PAYMENT_LABEL) as PaymentStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{PAYMENT_LABEL[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost" onClick={() => setPaymentDialog({ open: true, editing: p })}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deletePayment.mutate(p.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Vetrina pubblica portfolio */}
      <PortfolioSection project={project} />

      <ItemDialog
        projectId={id}
        state={itemDialog}
        onClose={() => setItemDialog({ open: false, editing: null })}
      />
      <PaymentDialog
        projectId={id}
        state={paymentDialog}
        onClose={() => setPaymentDialog({ open: false, editing: null })}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent = "text-ink",
}: {
  label: string;
  value: number;
  icon: typeof Euro;
  accent?: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs uppercase text-ink/60">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className={`mt-1 font-heading text-2xl ${accent}`}>€ {value.toFixed(2)}</p>
    </div>
  );
}

function FlatAmountEditor({
  projectId,
  currentAmount,
}: {
  projectId: string;
  currentAmount: number | null;
}) {
  const qc = useQueryClient();
  const [value, setValue] = useState<string>(currentAmount?.toString() ?? "");
  const [editing, setEditing] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      const num = value.trim() === "" ? null : Number(value);
      const { error } = await supabase.from("projects").update({ flat_amount: num }).eq("id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "project", projectId] });
      toast.success("Salvato");
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-3 text-sm">
      <span className="text-ink/60">Importo flat aggiuntivo:</span>
      {editing ? (
        <>
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 w-32"
            placeholder="0.00"
          />
          <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
            Salva
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Annulla
          </Button>
        </>
      ) : (
        <>
          <span className="font-medium">
            {currentAmount ? `€ ${Number(currentAmount).toFixed(2)}` : "—"}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            <Pencil className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
}

function ItemDialog({
  projectId,
  state,
  onClose,
}: {
  projectId: string;
  state: { open: boolean; editing: ProjectItem | null };
  onClose: () => void;
}) {
  return (
    <Dialog open={state.open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{state.editing ? "Modifica voce" : "Nuova voce"}</DialogTitle>
        </DialogHeader>
        {state.open && (
          <ItemForm
            key={state.editing?.id ?? "new"}
            projectId={projectId}
            editing={state.editing}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ItemForm({
  projectId,
  editing,
  onClose,
}: {
  projectId: string;
  editing: ProjectItem | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [description, setDescription] = useState(editing?.description ?? "");
  const [quantity, setQuantity] = useState(String(editing?.quantity ?? 1));
  const [unitPrice, setUnitPrice] = useState(String(editing?.unit_price ?? 0));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        project_id: projectId,
        description: description.trim(),
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
      };
      if (editing) {
        const { error } = await supabase.from("project_items").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("project_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "project-items", projectId] });
      toast.success("Salvato");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!description.trim()) {
          toast.error("Descrizione richiesta");
          return;
        }
        save.mutate();
      }}
      className="space-y-3"
    >
      <div className="space-y-2">
        <Label>Descrizione</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Quantità</Label>
          <Input type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Prezzo unitario (€)</Label>
          <Input type="number" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
        </div>
      </div>
      <p className="text-sm text-ink/60">
        Totale: <span className="font-medium text-ink">€ {(Number(quantity) * Number(unitPrice)).toFixed(2)}</span>
      </p>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
        <Button type="submit" disabled={save.isPending} className="bg-friuli-blue text-cream hover:bg-friuli-blue/90">
          Salva
        </Button>
      </DialogFooter>
    </form>
  );
}

function PaymentDialog({
  projectId,
  state,
  onClose,
}: {
  projectId: string;
  state: { open: boolean; editing: PaymentSchedule | null };
  onClose: () => void;
}) {
  return (
    <Dialog open={state.open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{state.editing ? "Modifica scadenza" : "Nuova scadenza"}</DialogTitle>
        </DialogHeader>
        {state.open && (
          <PaymentForm
            key={state.editing?.id ?? "new"}
            projectId={projectId}
            editing={state.editing}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PaymentForm({
  projectId,
  editing,
  onClose,
}: {
  projectId: string;
  editing: PaymentSchedule | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState(String(editing?.amount ?? ""));
  const [dueDate, setDueDate] = useState(editing?.due_date ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<PaymentStatus>(editing?.status ?? "da_pagare");
  const [notes, setNotes] = useState(editing?.notes ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        project_id: projectId,
        amount: Number(amount),
        due_date: dueDate,
        status,
        notes: notes.trim() || null,
      };
      if (editing) {
        const { error } = await supabase.from("payment_schedules").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("payment_schedules").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "payments", projectId] });
      void qc.invalidateQueries({ queryKey: ["admin", "upcoming-payments"] });
      toast.success("Salvato");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
          toast.error("Importo non valido");
          return;
        }
        save.mutate();
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Importo (€)</Label>
          <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Scadenza</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Stato</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as PaymentStatus)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(PAYMENT_LABEL) as PaymentStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{PAYMENT_LABEL[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Note</Label>
        <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
        <Button type="submit" disabled={save.isPending} className="bg-friuli-blue text-cream hover:bg-friuli-blue/90">
          Salva
        </Button>
      </DialogFooter>
    </form>
  );
}
