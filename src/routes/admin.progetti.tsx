import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useProjects,
  useDeleteProject,
  useInvalidateProjects,
  STATUS_LABEL,
  type ProjectStatus,
} from "@/hooks/useAdminData";
import { Plus, FolderKanban, Trash2, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/progetti")({
  head: () => ({
    meta: [
      { title: "Progetti — Admin Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProjectsPage,
});

const STATUS_COLORS: Record<ProjectStatus, string> = {
  richiesto: "bg-friuli-yellow text-ink",
  in_corso: "bg-friuli-blue text-cream",
  completato: "bg-emerald-500 text-white",
  archiviato: "bg-ink/20 text-ink",
};

function AdminProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [open, setOpen] = useState(false);

  const { data: projects = [], isLoading } = useProjects(
    statusFilter === "all" ? undefined : { status: statusFilter },
  );
  const deleteMutation = useDeleteProject();

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-4xl uppercase">Progetti</h1>
          <p className="mt-1 text-ink/70">{projects.length} totali</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
        >
          <Plus className="h-4 w-4" />
          Nuovo progetto
        </Button>
      </header>

      {/* Filtri */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
          Tutti
        </FilterChip>
        {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => (
          <FilterChip
            key={s}
            active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
          >
            {STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <p className="text-ink/60">Caricamento...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink/30 p-12 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-ink/30" />
          <p className="mt-3 font-heading text-xl uppercase">Nessun progetto</p>
          <p className="mt-2 text-sm text-ink/60">
            Crea il primo progetto per iniziare a tracciare lavori e pagamenti.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border-2 border-ink bg-cream p-4"
              style={{ boxShadow: "var(--shadow-brutal)" }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={STATUS_COLORS[p.status]}>
                      {STATUS_LABEL[p.status]}
                    </Badge>
                    <p className="font-heading text-lg uppercase">{p.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    Cliente: <span className="font-medium text-ink">{p.clients?.name ?? "—"}</span>
                  </p>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-ink/70">{p.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/progetti/$id" params={{ id: p.id }}>
                      Apri <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminare il progetto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Verranno cancellate anche tutte le voci e le scadenze pagamento.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(p.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Elimina
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <NewProjectDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 border-ink px-4 py-1 text-sm font-medium transition-colors ${
        active ? "bg-ink text-cream" : "bg-cream text-ink hover:bg-ink/5"
      }`}
    >
      {children}
    </button>
  );
}

function NewProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const invalidate = useInvalidateProjects();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("richiesto");
  const [saving, setSaving] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ["admin", "clients", "minimal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const reset = () => {
    setTitle("");
    setDescription("");
    setClientId("");
    setStatus("richiesto");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientId) {
      toast.error("Titolo e cliente sono richiesti");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("projects").insert({
        title: title.trim(),
        description: description.trim() || null,
        client_id: clientId,
        status,
      });
      if (error) throw error;
      toast.success("Progetto creato");
      invalidate();
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuovo progetto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Seleziona cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clients.length === 0 && (
              <p className="text-xs text-ink/60">
                Nessun cliente. <Link to="/admin/clienti" className="text-friuli-blue underline">Aggiungine uno</Link>.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titolo *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Sito web e-commerce"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descrizione</Label>
            <Textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Stato iniziale</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
            >
              {saving ? "Salvataggio..." : "Crea progetto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
