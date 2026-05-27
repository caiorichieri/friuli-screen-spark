import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Accesso amministratore — Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    }
  }, [loading, user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Accesso effettuato");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-heading text-2xl uppercase">
          Friuli <span className="text-friuli-blue">On</span>
        </Link>

        <div
          className="rounded-3xl border-2 border-ink bg-cream p-8"
          style={{ boxShadow: "var(--shadow-brutal-lg)" }}
        >
          <h1 className="font-heading text-3xl uppercase">Accedi</h1>
          <p className="mt-2 text-sm text-ink/70">
            Accedi al pannello di gestione. L'accesso è riservato.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@esempio.it"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Almeno 6 caratteri"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-friuli-blue text-cream hover:bg-friuli-blue/90"
            >
              {submitting ? "Attendere..." : "Accedi"}
            </Button>
          </form>

          <Link
            to="/forgot-password"
            className="mt-4 block text-center text-sm text-ink/70 underline-offset-4 hover:underline"
          >
            Password dimenticata?
          </Link>
        </div>
      </div>
    </div>
  );
}
