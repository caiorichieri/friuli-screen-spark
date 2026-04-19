import { useMemo, useState, useEffect, useCallback } from "react";
import { usePublicProjects, usePortfolioCategories } from "@/hooks/usePublicData";
import { ChevronLeft, ChevronRight, X, ExternalLink, ImageIcon } from "lucide-react";

export function Portfolio() {
  const { data: projects = [], isLoading } = usePublicProjects();
  const { data: categories = [] } = usePortfolioCategories();
  const [activeCat, setActiveCat] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{ projectId: string; index: number } | null>(null);

  const filtered = useMemo(() => {
    if (activeCat === "all") return projects;
    return projects.filter((p) => p.portfolio_category_id === activeCat);
  }, [projects, activeCat]);

  // Categorie effettivamente usate
  const usedCategories = useMemo(() => {
    const usedIds = new Set(projects.map((p) => p.portfolio_category_id).filter(Boolean));
    return categories.filter((c) => usedIds.has(c.id));
  }, [categories, projects]);

  const lightboxProject = lightbox ? projects.find((p) => p.id === lightbox.projectId) : null;
  const lightboxImages = useMemo(() => {
    if (!lightboxProject) return [];
    const all = [lightboxProject.cover_image_url, ...lightboxProject.gallery].filter(
      (x): x is string => !!x,
    );
    return all;
  }, [lightboxProject]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => {
    if (!lightbox || lightboxImages.length === 0) return;
    setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightboxImages.length });
  }, [lightbox, lightboxImages.length]);
  const prev = useCallback(() => {
    if (!lightbox || lightboxImages.length === 0) return;
    setLightbox({
      ...lightbox,
      index: (lightbox.index - 1 + lightboxImages.length) % lightboxImages.length,
    });
  }, [lightbox, lightboxImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, next, prev]);

  return (
    <section
      id="portfolio"
      className="border-t-2 border-ink bg-cream px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-block rounded-md bg-friuli-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Portfolio
            </div>
            <h2 className="text-4xl uppercase md:text-6xl">
              Trasformiamo idee <br />
              in <span className="text-friuli-blue">realtà tangibili</span>.
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink/70">
            Attenzione ai dettagli, comunicazione che parla a tutti, presente in ogni angolo della
            vita collettiva.
          </p>
        </div>

        {/* Filtri */}
        {usedCategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <FilterChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
              Tutti
            </FilterChip>
            {usedCategories.map((c) => (
              <FilterChip
                key={c.id}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-3xl border-2 border-ink bg-ink/5"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-ink/30 p-16 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-ink/30" />
            <p className="mt-3 font-heading text-xl uppercase">Presto qui i nostri lavori</p>
            <p className="mt-2 text-sm text-ink/60">Stiamo preparando il portfolio.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const cat = categories.find((c) => c.id === p.portfolio_category_id);
              const cover = p.cover_image_url;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLightbox({ projectId: p.id, index: 0 })}
                  className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-3xl border-2 border-ink bg-cream p-6 text-left transition-all hover:-translate-y-2"
                  style={{ boxShadow: "var(--shadow-brutal-lg)" }}
                >
                  {cover && (
                    <img
                      src={cover}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {/* Overlay gradiente per leggibilità */}
                  {cover && (
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  )}
                  <div className="relative z-10 flex items-start justify-between">
                    <div
                      className={`text-xs font-bold uppercase tracking-widest ${
                        cover ? "text-cream" : "text-ink/70"
                      }`}
                    >
                      {cat?.name ?? "Progetto"}
                    </div>
                    {p.year && (
                      <div
                        className={`rounded-md px-2 py-1 text-xs font-bold ${
                          cover
                            ? "bg-cream/90 text-ink"
                            : "bg-friuli-yellow text-ink"
                        }`}
                      >
                        {p.year}
                      </div>
                    )}
                  </div>
                  <div className="relative z-10">
                    <h3
                      className={`font-heading text-3xl uppercase leading-none ${
                        cover ? "text-cream" : "text-ink"
                      }`}
                    >
                      {p.title}
                    </h3>
                    {p.clients?.name && (
                      <p
                        className={`mt-1 text-sm ${
                          cover ? "text-cream/80" : "text-ink/60"
                        }`}
                      >
                        {p.clients.name}
                      </p>
                    )}
                    <div
                      className={`mt-4 flex size-10 items-center justify-center rounded-full border-2 transition-transform group-hover:rotate-45 ${
                        cover ? "border-cream text-cream" : "border-ink text-ink"
                      }`}
                    >
                      <span>↗</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && lightboxProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
          onClick={closeLightbox}
        >
          {/* Header */}
          <div
            className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-6 text-cream"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="font-heading text-2xl uppercase">{lightboxProject.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-cream/70">
                {lightboxProject.clients?.name && <span>{lightboxProject.clients.name}</span>}
                {lightboxProject.year && (
                  <>
                    <span>·</span>
                    <span>{lightboxProject.year}</span>
                  </>
                )}
                {lightboxImages.length > 1 && (
                  <>
                    <span>·</span>
                    <span>
                      {lightbox.index + 1} / {lightboxImages.length}
                    </span>
                  </>
                )}
              </div>
              {(lightboxProject.public_summary || lightboxProject.description) && (
                <p className="mt-2 max-w-2xl text-sm text-cream/80">
                  {lightboxProject.public_summary ?? lightboxProject.description}
                </p>
              )}
              {lightboxProject.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {lightboxProject.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-cream/30 px-2 py-0.5 text-xs text-cream/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {lightboxProject.external_url && (
                <a
                  href={lightboxProject.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-friuli-yellow hover:underline"
                >
                  Caso studio <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Chiudi"
              className="shrink-0 rounded-full border-2 border-cream/40 p-2 text-cream transition-colors hover:bg-cream/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image */}
          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxImages.length > 0 ? (
              <img
                src={lightboxImages[lightbox.index]}
                alt={`${lightboxProject.title} ${lightbox.index + 1}`}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-cream/30 p-16 text-center text-cream/60">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="mt-3">Nessuna immagine disponibile</p>
              </div>
            )}

            {lightboxImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Precedente"
                  className="absolute left-2 rounded-full border-2 border-cream/40 bg-ink/60 p-3 text-cream transition-colors hover:bg-cream/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Successivo"
                  className="absolute right-2 rounded-full border-2 border-cream/40 bg-ink/60 p-3 text-cream transition-colors hover:bg-cream/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
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
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors ${
        active ? "bg-ink text-cream" : "bg-cream text-ink hover:bg-ink/5"
      }`}
    >
      {children}
    </button>
  );
}
