import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Recupera password — Friuli On" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Email inviata! Controlla la tua casella.");
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
          <h1 className="font-heading text-3xl uppercase">Recupera password</h1>
          <p className="mt-2 text-sm text-ink/70">
            {sent
              ? "Ti abbiamo inviato un'email con le istruzioni per reimpostare la password."
              : "Inserisci la tua email per ricevere il link di reimpostazione."}
          </p>

          {!sent && (
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
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-friuli-blue text-cream hover:bg-friuli-blue/90"
              >
                {submitting ? "Invio..." : "Invia link di reset"}
              </Button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-4 block text-center text-sm text-friuli-blue underline-offset-4 hover:underline"
          >
            Torna al login
          </Link>
        </div>
      </div>
    </div>
  );
}
