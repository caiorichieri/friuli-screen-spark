import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/servizi")({
  head: () => ({
    meta: [
      { title: "Gestione servizi — Admin Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminServicesPage,
});

type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  category_id: string | null;
  sort_order: number;
  is_public: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Category[];
    },
  });

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Servizio eliminato");
      void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      void queryClient.invalidateQueries({ queryKey: ["services", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublic = useMutation({
    mutationFn: async ({ id, is_public }: { id: string; is_public: boolean }) => {
      const { error } = await supabase.from("services").update({ is_public }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      void queryClient.invalidateQueries({ queryKey: ["services", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-4xl uppercase">Servizi</h1>
          <p className="mt-1 text-ink/70">{services.length} totali</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
        >
          <Plus className="h-4 w-4" />
          Nuovo servizio
        </Button>
      </header>

      {isLoading ? (
        <p className="text-ink/60">Caricamento...</p>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink/30 p-12 text-center">
          <p className="font-heading text-xl uppercase">Nessun servizio</p>
          <p className="mt-2 text-sm text-ink/60">
            Aggiungi il tuo primo servizio per mostrarlo sul sito.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-col rounded-2xl border-2 border-ink bg-cream p-4"
              style={{ boxShadow: "var(--shadow-brutal)" }}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{service.icon || "✨"}</span>
                {service.category_id && (
                  <span className="rounded-full bg-friuli-blue px-2 py-0.5 text-xs text-cream">
                    {categoryById[service.category_id]?.name ?? "—"}
                  </span>
                )}
              </div>
              <p className="mt-3 font-heading text-lg uppercase leading-tight">
                {service.title}
              </p>
              {service.description && (
                <p className="mt-2 line-clamp-3 text-sm text-ink/70">{service.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-3">
                <label className="flex items-center gap-2 text-xs">
                  <Switch
                    checked={service.is_public}
                    onCheckedChange={(v) =>
                      togglePublic.mutate({ id: service.id, is_public: v })
                    }
                  />
                  Pubblico
                </label>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(service);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminare {service.title}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Questa azione non può essere annullata.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(service.id)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifica servizio" : "Nuovo servizio"}</DialogTitle>
          </DialogHeader>
          {open && (
            <ServiceForm
              key={editing?.id ?? "new"}
              service={editing}
              categories={categories}
              onCancel={() => setOpen(false)}
              onSaved={() => {
                void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
                void queryClient.invalidateQueries({ queryKey: ["services", "public"] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
                setOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceForm({
  service,
  categories,
  onCancel,
  onSaved,
}: {
  service: Service | null;
  categories: Category[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [icon, setIcon] = useState(service?.icon ?? "");
  const [categoryId, setCategoryId] = useState<string>(service?.category_id ?? "");
  const [sortOrder, setSortOrder] = useState(service?.sort_order ?? 0);
  const [isPublic, setIsPublic] = useState(service?.is_public ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Inserisci il titolo del servizio");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slugify(title),
        description: description.trim() || null,
        icon: icon.trim() || null,
        category_id: categoryId || null,
        sort_order: sortOrder,
        is_public: isPublic,
      };

      if (service) {
        const { error } = await supabase.from("services").update(payload).eq("id", service.id);
        if (error) throw error;
        toast.success("Servizio aggiornato");
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
        toast.success("Servizio creato");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titolo *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="icon">Icona (emoji)</Label>
          <Input
            id="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🔍"
            maxLength={4}
          />
        </div>
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={categoryId || "none"} onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nessuna</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione visibile sul sito..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="sort">Ordine</Label>
          <Input
            id="sort"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2 text-sm">
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            Pubblico sul sito
          </label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
        >
          {saving ? "Salvataggio..." : "Salva"}
        </Button>
      </DialogFooter>
    </form>
  );
}
