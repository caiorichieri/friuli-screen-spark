import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEditableLanding } from "@/hooks/useClientLanding";
import { LandingEditor } from "@/components/landing/LandingEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

export const Route = createFileRoute("/landing/$clientId")({
  head: () => ({
    meta: [
      { title: "Modifica landing page — Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditLandingPage,
});

function EditLandingPage() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) void navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ["client-info", clientId],
    enabled: !!user && !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, slug")
        .eq("id", clientId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: landing, isLoading: landingLoading } = useEditableLanding(clientId);

  if (authLoading || !user || clientLoading || landingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-ink/60">Caricamento...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div
          className="max-w-md rounded-3xl border-2 border-ink bg-cream p-8 text-center"
          style={{ boxShadow: "var(--shadow-brutal-lg)" }}
        >
          <h1 className="font-heading text-2xl uppercase">Non autorizzato</h1>
          <p className="mt-3 text-ink/70">
            Non hai accesso a questa landing page.
          </p>
          <Button asChild className="mt-6">
            <Link to={isAdmin ? "/admin/clienti" : "/dashboard"}>Torna indietro</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b-2 border-ink bg-cream px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to={isAdmin ? "/admin/clienti" : "/dashboard"}>
              <ArrowLeft className="h-4 w-4" />
              {isAdmin ? "Clienti" : "Area cliente"}
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <p className="hidden text-xs text-ink/60 sm:block">{user.email}</p>
            <Button onClick={() => void signOut()} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-6">
        <LandingEditor
          clientId={client.id}
          clientSlug={client.slug}
          clientName={client.name}
          landing={landing ?? null}
        />
      </main>
    </div>
  );
}
