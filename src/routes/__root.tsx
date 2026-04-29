import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";

import appCss from "../styles.css?url";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const LOCAL_BUSINESS_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Friuli On",
  description:
    "Pubblicità locale, monitor TV indoor e comunicazione integrata in Friuli Venezia Giulia.",
  url: "https://friulion.it",
  telephone: "+39 351 8230667",
  email: "info@friulion.it",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Circonvallazione Sud, 80",
    addressLocality: "Codroipo",
    postalCode: "33033",
    addressRegion: "UD",
    addressCountry: "IT",
  },
  vatID: "IT03157410303",
  areaServed: "Friuli Venezia Giulia",
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Friuli On — Online. E nei luoghi che contano." },
      {
        name: "description",
        content:
          "Friuli On: rete di monitor TV indoor nei luoghi più frequentati del Friuli Venezia Giulia. Pubblicità locale accessibile, efficace e sostenibile.",
      },
      { name: "author", content: "Friuli On" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:site_name", content: "Friuli On" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/iME4qutiMvQWTfEWBPjGKRFf98H3/social-images/social-1776447337802-LOGO_FRIULI_ON_MARCHIO.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/iME4qutiMvQWTfEWBPjGKRFf98H3/social-images/social-1776447337802-LOGO_FRIULI_ON_MARCHIO.webp" },
      { property: "og:title", content: "Friuli On — Online. E nei luoghi che contano." },
      { name: "twitter:title", content: "Friuli On — Online. E nei luoghi che contano." },
      { name: "description", content: "Agenzia di marketing digitale in Friuli. Siti web, SEO, Google e Meta ADS, grafica e una rete di monitor indoor nel territorio. Siamo dove conta." },
      { property: "og:description", content: "Agenzia di marketing digitale in Friuli. Siti web, SEO, Google e Meta ADS, grafica e una rete di monitor indoor nel territorio. Siamo dove conta." },
      { name: "twitter:description", content: "Agenzia di marketing digitale in Friuli. Siti web, SEO, Google e Meta ADS, grafica e una rete di monitor indoor nel territorio. Siamo dove conta." },
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
    <html lang="en">
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
