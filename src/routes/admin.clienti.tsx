import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Plus, Pencil, Trash2, ExternalLink, ImagePlus, LayoutTemplate, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/clienti")({
  head: () => ({
    meta: [
      { title: "Gestione clienti — Admin Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminClientsPage,
});

type Client = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
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

function AdminClientsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);
  const [assigning, setAssigning] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["admin", "clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Client[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (client: Client) => {
      // Try to delete logo from storage if hosted in our bucket
      if (client.logo_url?.includes("/client-logos/")) {
        const path = client.logo_url.split("/client-logos/")[1]?.split("?")[0];
        if (path) await supabase.storage.from("client-logos").remove([path]);
      }
      const { error } = await supabase.from("clients").delete().eq("id", client.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente eliminato");
      void queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
      void queryClient.invalidateQueries({ queryKey: ["clients", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublicMutation = useMutation({
    mutationFn: async ({ id, is_public }: { id: string; is_public: boolean }) => {
      const { error } = await supabase.from("clients").update({ is_public }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
      void queryClient.invalidateQueries({ queryKey: ["clients", "public"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  const openEditor = (client?: Client) => {
    setEditing(client ?? null);
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-4xl uppercase">Clienti</h1>
          <p className="mt-1 text-ink/70">{clients.length} totali</p>
        </div>
        <Button
          onClick={() => openEditor()}
          className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
        >
          <Plus className="h-4 w-4" />
          Nuovo cliente
        </Button>
      </header>

      {isLoading ? (
        <p className="text-ink/60">Caricamento...</p>
      ) : clients.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink/30 p-12 text-center">
          <p className="font-heading text-xl uppercase">Nessun cliente</p>
          <p className="mt-2 text-sm text-ink/60">
            Aggiungi il tuo primo cliente per vederlo apparire sul sito.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex flex-col rounded-2xl border-2 border-ink bg-cream p-4"
              style={{ boxShadow: "var(--shadow-brutal)" }}
            >
              <div className="flex h-28 items-center justify-center rounded-lg bg-white p-3">
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <ImagePlus className="h-8 w-8 text-ink/30" />
                )}
              </div>
              <div className="mt-3 flex-1">
                <p className="font-heading text-lg uppercase leading-tight">{client.name}</p>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-friuli-blue hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {client.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-3">
                <label className="flex items-center gap-2 text-xs">
                  <Switch
                    checked={client.is_public}
                    onCheckedChange={(v) =>
                      togglePublicMutation.mutate({ id: client.id, is_public: v })
                    }
                  />
                  Pubblico
                </label>
                <div className="flex flex-wrap gap-1">
                  <Button asChild size="icon" variant="ghost" title="Gestisci landing">
                    <Link to="/landing/$clientId" params={{ clientId: client.id }}>
                      <LayoutTemplate className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Assegna utente"
                    onClick={() => setAssigning(client)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEditor(client)}>
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
                        <AlertDialogTitle>Eliminare {client.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Questa azione non può essere annullata. Il cliente verrà rimosso
                          dal sito e dal database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(client)}
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

      <ClientEditor
        open={open}
        onOpenChange={setOpen}
        client={editing}
        onSaved={() => {
          void queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
          void queryClient.invalidateQueries({ queryKey: ["clients", "public"] });
          void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        }}
      />

      <AssignManagerDialog
        client={assigning}
        onOpenChange={(open) => !open && setAssigning(null)}
      />
    </div>
  );
}

function AssignManagerDialog({
  client,
  onOpenChange,
}: {
  client: Client | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: managers = [], refetch } = useQuery({
    queryKey: ["client-managers", client?.id],
    enabled: !!client,
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("client_managers")
        .select("id, user_id, created_at")
        .eq("client_id", client!.id);
      if (error) throw error;
      const userIds = (rows ?? []).map((r) => r.user_id);
      let profilesMap = new Map<string, { email: string | null; display_name: string | null }>();
      if (userIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, email, display_name")
          .in("user_id", userIds);
        profilesMap = new Map((profs ?? []).map((p) => [p.user_id, p]));
      }
      return (rows ?? []).map((r) => ({
        ...r,
        profile: profilesMap.get(r.user_id) ?? null,
      }));
    },
  });

  const handleAssign = async () => {
    if (!client || !email.trim()) return;
    setSaving(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();
      if (profileError) throw profileError;
      if (!profile) {
        toast.error("Nessun utente trovato con questa email. Chiedi al cliente di registrarsi prima.");
        return;
      }

      const { error: insertError } = await supabase
        .from("client_managers")
        .insert({ client_id: client.id, user_id: profile.user_id });
      if (insertError && !insertError.message.includes("duplicate")) throw insertError;

      // Ensure the user has the 'client' role
      await supabase
        .from("user_roles")
        .insert({ user_id: profile.user_id, role: "client" as const });

      toast.success("Utente assegnato");
      setEmail("");
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["client-managers"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("client_managers").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Rimosso");
    void refetch();
  };

  return (
    <Dialog open={!!client} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assegna utente a {client?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assign-email">Email utente registrato</Label>
            <div className="flex gap-2">
              <Input
                id="assign-email"
                type="email"
                placeholder="cliente@esempio.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAssign}
                disabled={saving || !email.trim()}
                className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
              >
                Assegna
              </Button>
            </div>
            <p className="text-xs text-ink/60">
              L'utente deve aver già creato un account su /login.
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Utenti assegnati</p>
            {managers.length === 0 ? (
              <p className="text-xs text-ink/60">Nessuno ancora.</p>
            ) : (
              <ul className="space-y-1">
                {managers.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded border border-ink/20 px-2 py-1 text-sm"
                  >
                    <span>{m.profile?.email ?? m.user_id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleRemove(m.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientEditor({
  open,
  onOpenChange,
  client,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSaved: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? "Modifica cliente" : "Nuovo cliente"}</DialogTitle>
        </DialogHeader>
        {open && (
          <ClientForm
            key={client?.id ?? "new"}
            client={client}
            onCancel={() => onOpenChange(false)}
            onSaved={() => {
              onSaved();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ClientForm({
  client,
  onCancel,
  onSaved,
}: {
  client: Client | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(client?.name ?? "");
  const [website, setWebsite] = useState(client?.website ?? "");
  const [description, setDescription] = useState(client?.description ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(client?.logo_url ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(client?.is_public ?? true);
  const [sortOrder, setSortOrder] = useState(client?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Inserisci il nome del cliente");
      return;
    }
    setSaving(true);
    try {
      let finalLogoUrl = logoUrl;

      // Upload new logo if provided
      if (logoFile) {
        const ext = logoFile.name.split(".").pop() || "png";
        const path = `${slugify(name)}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("client-logos")
          .upload(path, logoFile, { upsert: false, cacheControl: "31536000" });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("client-logos").getPublicUrl(path);
        finalLogoUrl = urlData.publicUrl;
      }

      const payload = {
        name: name.trim(),
        slug: slugify(name),
        website: website.trim() || null,
        description: description.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        logo_url: finalLogoUrl,
        is_public: isPublic,
        sort_order: sortOrder,
      };

      if (client) {
        const { error } = await supabase.from("clients").update(payload).eq("id", client.id);
        if (error) throw error;
        toast.success("Cliente aggiornato");
      } else {
        const { error } = await supabase.from("clients").insert(payload);
        if (error) throw error;
        toast.success("Cliente creato");
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
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-3">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-white p-2">
            {logoFile ? (
              <img
                src={URL.createObjectURL(logoFile)}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            ) : logoUrl ? (
              <img src={logoUrl} alt="" className="max-h-full max-w-full object-contain" />
            ) : (
              <ImagePlus className="h-6 w-6 text-ink/30" />
            )}
          </div>
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <p className="text-xs text-ink/60">PNG con sfondo trasparente, max 2MB consigliato.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Sito web</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email contatto</Label>
          <Input
            id="email"
            type="email"
            placeholder="cliente@esempio.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+39 ..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Note interne</Label>
        <Textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Note opzionali, non visibili sul sito."
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
