import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";

import appCss from "../styles.css?url";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <title>Pagina non trovata — Friuli On</title>
      <meta name="robots" content="noindex" />
      <div className="max-w-md text-center">
        <p className="text-7xl font-bold text-foreground">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

const LOCAL_BUSINESS_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AdvertisingAgency"],
  "@id": "https://friulion.it/#business",
  name: "Friuli On",
  description:
    "Pubblicità locale, monitor TV indoor e comunicazione integrata in Friuli Venezia Giulia.",
  url: "https://friulion.it",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/iME4qutiMvQWTfEWBPjGKRFf98H3/social-images/social-1776447337802-LOGO_FRIULI_ON_MARCHIO.webp",
  image: "https://storage.googleapis.com/gpt-engineer-file-uploads/iME4qutiMvQWTfEWBPjGKRFf98H3/social-images/social-1776447337802-LOGO_FRIULI_ON_MARCHIO.webp",
  telephone: "+39 351 8230667",
  email: "info@friulion.it",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Circonvallazione Sud, 80",
    addressLocality: "Codroipo",
    postalCode: "33033",
    addressRegion: "UD",
    addressCountry: "IT",
  },
  geo: { "@type": "GeoCoordinates", latitude: 45.9603, longitude: 12.9776 },
  vatID: "IT03157410303",
  areaServed: [
    { "@type": "AdministrativeArea", name: "Friuli Venezia Giulia" },
    { "@type": "City", name: "Codroipo" },
    { "@type": "City", name: "Udine" },
    { "@type": "City", name: "Lignano Sabbiadoro" },
    { "@type": "City", name: "Pordenone" },
  ],
  knowsAbout: [
    "Monitor TV indoor",
    "Pubblicità locale",
    "SEO",
    "Google Ads",
    "Meta Ads",
    "Grafica",
    "Siti web",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servizi Friuli On",
    itemListElement: [
      "Circuito monitor TV indoor",
      "SEO e posizionamento su Google",
      "Campagne Google Ads",
      "Campagne Meta Ads",
      "Grafica e branding",
      "Realizzazione siti web",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "QsAXCcrVUnX0RqiEBDXX2WNkwt1PrCAjHXMtX8_AgFs" },
      { title: "Friuli On — Pubblicità locale e monitor indoor in FVG" },
      { name: "author", content: "Friuli On" },
      { name: "description", content: "Monitor TV indoor in bar, farmacie e palestre del Friuli, più SEO, ADS, grafica e siti web. Richiedi un preventivo gratuito." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:site_name", content: "Friuli On" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/iME4qutiMvQWTfEWBPjGKRFf98H3/social-images/social-1776447337802-LOGO_FRIULI_ON_MARCHIO.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/iME4qutiMvQWTfEWBPjGKRFf98H3/social-images/social-1776447337802-LOGO_FRIULI_ON_MARCHIO.webp" },
      { property: "og:title", content: "Friuli On — Pubblicità locale e monitor indoor in FVG" },
      { name: "twitter:title", content: "Friuli On — Pubblicità locale e monitor indoor in FVG" },
      { property: "og:description", content: "Monitor TV indoor in bar, farmacie e palestre del Friuli, più SEO, ADS, grafica e siti web. Richiedi un preventivo gratuito." },
      { name: "twitter:description", content: "Monitor TV indoor in bar, farmacie e palestre del Friuli, più SEO, ADS, grafica e siti web. Richiedi un preventivo gratuito." },
      {
        httpEquiv: "Content-Security-Policy",
        content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https: ; connect-src 'self' https://jgxuweezpxqpihtajnwt.supabase.co wss://jgxuweezpxqpihtajnwt.supabase.co; frame-src 'self' https://www.youtube.com https://player.vimeo.com; form-action 'self'; base-uri 'self';",
      },
      { httpEquiv: "Referrer-Policy", content: "strict-origin-when-cross-origin" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Outfit:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: LOCAL_BUSINESS_JSONLD,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
