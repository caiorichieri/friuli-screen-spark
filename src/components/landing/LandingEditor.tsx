import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Plus,
  Trash2,
  GripVertical,
  ImagePlus,
  ExternalLink,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ICON_KEYS, LANDING_ICONS, getLandingIcon } from "@/lib/landing-icons";
import type { ClientLanding, LandingLink } from "@/hooks/useClientLanding";
import { Link } from "@tanstack/react-router";

type Props = {
  clientId: string;
  clientSlug: string;
  clientName: string;
  landing: ClientLanding | null;
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyLanding(clientId: string): Omit<ClientLanding, "id" | "created_at" | "updated_at"> {
  return {
    client_id: clientId,
    enabled: false,
    cover_image_url: null,
    avatar_url: null,
    intro_title: null,
    intro_text: null,
    accent_color: "#f59e0b",
    video_url: null,
    links: [],
    gallery: [],
  };
}

export function LandingEditor({ clientId, clientSlug, clientName, landing }: Props) {
  const queryClient = useQueryClient();
  const initial = landing ?? emptyLanding(clientId);

  const [enabled, setEnabled] = useState(initial.enabled);
  const [coverUrl, setCoverUrl] = useState<string | null>(initial.cover_image_url);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial.avatar_url);
  const [introTitle, setIntroTitle] = useState(initial.intro_title ?? "");
  const [introText, setIntroText] = useState(initial.intro_text ?? "");
  const [accentColor, setAccentColor] = useState(initial.accent_color);
  const [videoUrl, setVideoUrl] = useState(initial.video_url ?? "");
  const [links, setLinks] = useState<LandingLink[]>(initial.links);
  const [gallery, setGallery] = useState<string[]>(initial.gallery);

  useEffect(() => {
    if (landing) {
      setEnabled(landing.enabled);
      setCoverUrl(landing.cover_image_url);
      setAvatarUrl(landing.avatar_url);
      setIntroTitle(landing.intro_title ?? "");
      setIntroText(landing.intro_text ?? "");
      setAccentColor(landing.accent_color);
      setVideoUrl(landing.video_url ?? "");
      setLinks(landing.links);
      setGallery(landing.gallery);
    }
  }, [landing]);

  const uploadFile = async (file: File, folder: "cover" | "avatar" | "gallery") => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${clientId}/${folder}/${Date.now()}-${makeId()}.${ext}`;
    const { error } = await supabase.storage
      .from("client-landings")
      .upload(path, file, { upsert: false, cacheControl: "31536000" });
    if (error) throw error;
    return supabase.storage.from("client-landings").getPublicUrl(path).data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Strip any link with an unsafe URL protocol (javascript:, data:, etc.) before saving
      const sanitizedLinks = links
        .map((l) => ({ ...l, url: l.url.trim() }))
        .filter((l) => {
          if (!l.url) return false;
          try {
            const proto = new URL(l.url, "https://placeholder.invalid").protocol;
            return ["https:", "http:", "mailto:", "tel:"].includes(proto);
          } catch {
            return false;
          }
        });
      if (sanitizedLinks.length !== links.filter((l) => l.url.trim()).length) {
        toast.warning("Alcuni link sono stati rimossi: usa solo http(s), mailto: o tel:");
      }
      const payload = {
        client_id: clientId,
        enabled,
        cover_image_url: coverUrl,
        avatar_url: avatarUrl,
        intro_title: introTitle.trim() || null,
        intro_text: introText.trim() || null,
        accent_color: accentColor,
        video_url: videoUrl.trim() || null,
        links: sanitizedLinks,
        gallery,
      };
      if (landing) {
        const { error } = await supabase
          .from("client_landings")
          .update(payload)
          .eq("id", landing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("client_landings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Landing page salvata");
      void queryClient.invalidateQueries({ queryKey: ["landing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "cover");
      setCoverUrl(url);
      toast.success("Copertina caricata");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      e.target.value = "";
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "avatar");
      setAvatarUrl(url);
      toast.success("Logo caricato");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f, "gallery")));
      setGallery((g) => [...g, ...urls]);
      toast.success(`${urls.length} immagini aggiunte`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      e.target.value = "";
    }
  };

  const addLink = () => {
    setLinks((l) => [
      ...l,
      { id: makeId(), label: "Nuovo link", url: "", icon: "link" },
    ]);
  };

  const updateLink = (id: string, patch: Partial<LandingLink>) => {
    setLinks((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeLink = (id: string) => {
    setLinks((l) => l.filter((x) => x.id !== id));
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeGalleryImage = (idx: number) => {
    setGallery((g) => g.filter((_, i) => i !== idx));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-32">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl uppercase leading-tight">Landing page</h1>
          <p className="mt-1 text-sm text-ink/70">
            Cliente: <strong>{clientName}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {enabled && (
            <Button asChild variant="outline" size="sm">
              <a href={`/${clientSlug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Vedi pubblicata
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Status */}
      <section
        className="rounded-2xl border-2 border-ink bg-cream p-4"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${enabled ? "bg-green-500" : "bg-ink/30"}`}
              />
              <p className="font-bold">{enabled ? "Pubblicata" : "Non pubblicata"}</p>
            </div>
            <p className="mt-1 text-xs text-ink/60">
              {enabled
                ? `Visibile a chiunque su friulion.it/${clientSlug}`
                : "Solo tu puoi vederla. Attiva per pubblicare."}
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </section>

      {/* Cover + Avatar */}
      <section
        className="space-y-4 rounded-2xl border-2 border-ink bg-cream p-5"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <h2 className="font-heading text-lg uppercase">Immagini</h2>

        {/* Cover */}
        <div className="space-y-2">
          <Label>Copertina (sfondo header)</Label>
          <div
            className="relative h-40 w-full overflow-hidden rounded-lg border-2 border-ink bg-ink/5 bg-cover bg-center"
            style={{
              backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
            }}
          >
            {!coverUrl && (
              <div className="flex h-full w-full items-center justify-center text-ink/40">
                <ImagePlus className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" onChange={handleCoverUpload} />
            {coverUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setCoverUrl(null)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="space-y-2">
          <Label>Logo (cerchio sopra il titolo)</Label>
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-ink bg-cream">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImagePlus className="h-6 w-6 text-ink/30" />
                </div>
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleAvatarUpload} />
            {avatarUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setAvatarUrl(null)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Title + Text */}
      <section
        className="space-y-4 rounded-2xl border-2 border-ink bg-cream p-5"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <h2 className="font-heading text-lg uppercase">Testo</h2>
        <div className="space-y-2">
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={introTitle}
            onChange={(e) => setIntroTitle(e.target.value)}
            placeholder={clientName}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Descrizione</Label>
          <Textarea
            id="desc"
            rows={4}
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            placeholder="Una breve descrizione che apparirà sotto il titolo."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accent">Colore principale</Label>
          <div className="flex items-center gap-3">
            <input
              id="accent"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded border-2 border-ink"
            />
            <Input
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-32 font-mono"
            />
          </div>
        </div>
      </section>

      {/* Links */}
      <section
        className="space-y-3 rounded-2xl border-2 border-ink bg-cream p-5"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg uppercase">Pulsanti / Link</h2>
          <Button type="button" onClick={addLink} size="sm">
            <Plus className="h-4 w-4" />
            Aggiungi
          </Button>
        </div>
        <p className="text-xs text-ink/60">
          Trascina per riordinare. I primi 3 link usano il colore principale come sfondo.
        </p>
        {links.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-ink/30 p-4 text-center text-sm text-ink/50">
            Nessun link. Clicca "Aggiungi" per crearne uno.
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {links.map((link) => (
                  <SortableLinkRow
                    key={link.id}
                    link={link}
                    onChange={(patch) => updateLink(link.id, patch)}
                    onRemove={() => removeLink(link.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      {/* Video */}
      <section
        className="space-y-2 rounded-2xl border-2 border-ink bg-cream p-5"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <h2 className="font-heading text-lg uppercase">Video</h2>
        <Label htmlFor="video">URL YouTube o Vimeo (opzionale)</Label>
        <Input
          id="video"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </section>

      {/* Gallery */}
      <section
        className="space-y-3 rounded-2xl border-2 border-ink bg-cream p-5"
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg uppercase">Galleria foto</h2>
          <Label htmlFor="gallery-upload" className="cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-md bg-friuli-blue px-3 py-2 text-sm text-cream hover:bg-friuli-blue/90">
              <Plus className="h-4 w-4" /> Aggiungi
            </span>
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </Label>
        </div>
        {gallery.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-ink/30 p-4 text-center text-sm text-ink/50">
            Nessuna immagine.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {gallery.map((src, i) => (
              <div key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-ink">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-cream px-4 py-3 shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link to="/" className="text-sm text-ink/60 hover:underline">
            ← Indietro
          </Link>
          <Button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="bg-friuli-blue text-cream hover:bg-friuli-blue/90"
          >
            {saveMutation.isPending ? "Salvataggio..." : "Salva modifiche"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortableLinkRow({
  link,
  onChange,
  onRemove,
}: {
  link: LandingLink;
  onChange: (patch: Partial<LandingLink>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const Icon = getLandingIcon(link.icon);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border-2 border-ink bg-white p-2"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-ink/40 hover:text-ink"
        aria-label="Trascina"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <Select value={link.icon} onValueChange={(v) => onChange({ icon: v as LandingLink["icon"] })}>
        <SelectTrigger className="w-14 px-2">
          <Icon className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent>
          {ICON_KEYS.map((key) => {
            const I = LANDING_ICONS[key].Icon;
            return (
              <SelectItem key={key} value={key}>
                <span className="inline-flex items-center gap-2">
                  <I className="h-4 w-4" />
                  {LANDING_ICONS[key].label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Input
        placeholder="Etichetta"
        value={link.label}
        onChange={(e) => onChange({ label: e.target.value })}
        className="flex-1"
      />
      <Input
        placeholder="https://..."
        value={link.url}
        onChange={(e) => onChange({ url: e.target.value })}
        className="flex-1"
      />
      <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
