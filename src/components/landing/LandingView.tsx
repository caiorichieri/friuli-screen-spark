import { getLandingIcon } from "@/lib/landing-icons";
import type { LandingWithClient } from "@/hooks/useClientLanding";
import { Mail } from "lucide-react";

function getYouTubeEmbed(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function getVimeoEmbed(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

export function LandingView({ landing }: { landing: LandingWithClient }) {
  const accent = landing.accent_color || "#f59e0b";
  const ytEmbed = landing.video_url ? getYouTubeEmbed(landing.video_url) : null;
  const vimeoEmbed = landing.video_url ? getVimeoEmbed(landing.video_url) : null;
  const embed = ytEmbed ?? vimeoEmbed;

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-md bg-cream pb-12 shadow-2xl">
        {/* Header with cover */}
        <header className="relative">
          <div
            className="relative h-72 w-full bg-cover bg-center"
            style={{
              backgroundImage: landing.cover_image_url
                ? `url(${landing.cover_image_url})`
                : `linear-gradient(135deg, ${accent}, var(--ink))`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
          </div>

          {/* Avatar */}
          <div className="-mt-12 flex justify-center">
            <div
              className="h-24 w-24 overflow-hidden rounded-full border-4 border-cream bg-cream shadow-lg"
              style={{ boxShadow: `0 0 0 2px ${accent}` }}
            >
              {landing.avatar_url ? (
                <img
                  src={landing.avatar_url}
                  alt={landing.intro_title ?? landing.client.name}
                  className="h-full w-full object-cover"
                />
              ) : landing.client.logo_url ? (
                <img
                  src={landing.client.logo_url}
                  alt={landing.client.name}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center font-heading text-3xl"
                  style={{ color: accent }}
                >
                  {(landing.intro_title ?? landing.client.name).charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Title + description */}
        <section className="px-6 pt-4 text-center">
          <h1 className="font-heading text-2xl uppercase leading-tight text-ink">
            {landing.intro_title || landing.client.name}
          </h1>
          {landing.intro_text && (
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/80 whitespace-pre-line">
              {landing.intro_text}
            </p>
          )}
        </section>

        {/* Links */}
        {landing.links.length > 0 && (
          <section className="mt-6 space-y-3 px-6">
            {landing.links.map((link, idx) => {
              const Icon = getLandingIcon(link.icon);
              const isPrimary = idx < 3;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-full border-2 border-ink px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: isPrimary ? accent : "var(--cream)",
                    color: isPrimary ? "var(--ink)" : "var(--ink)",
                    boxShadow: "2px 2px 0 0 var(--ink)",
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-center">{link.label}</span>
                </a>
              );
            })}
          </section>
        )}

        {/* Video */}
        {embed && (
          <section className="mt-8 px-6">
            <div className="aspect-video overflow-hidden rounded-2xl border-2 border-ink">
              <iframe
                src={embed}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}

        {/* Gallery */}
        {landing.gallery.length > 0 && (
          <section className="mt-8 px-6">
            <div className="grid grid-cols-3 gap-2">
              {landing.gallery.map((src, i) => (
                <a
                  key={`${src}-${i}`}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square overflow-hidden rounded-lg border-2 border-ink"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer mailto */}
        <footer className="mt-10 flex justify-center px-6 pb-2">
          <a
            href="https://friulion.it"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
          >
            <Mail className="h-4 w-4" />
            powered by Friuli On
          </a>
        </footer>
      </div>
    </div>
  );
}
