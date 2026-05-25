import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LandingIconKey } from "@/lib/landing-icons";

export type LandingLink = {
  id: string;
  label: string;
  url: string;
  icon: LandingIconKey;
};

export type ClientLanding = {
  id: string;
  client_id: string;
  enabled: boolean;
  cover_image_url: string | null;
  avatar_url: string | null;
  intro_title: string | null;
  intro_text: string | null;
  accent_color: string;
  video_url: string | null;
  links: LandingLink[];
  gallery: string[];
  created_at: string;
  updated_at: string;
};

export type LandingWithClient = ClientLanding & {
  client: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    website: string | null;
  };
};

function normalize(row: any): ClientLanding {
  return {
    ...row,
    links: Array.isArray(row.links) ? row.links : [],
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
  };
}

/** Public landing by client slug (only enabled landings). */
export function usePublicLandingBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["landing", "public", slug],
    enabled: !!slug,
    queryFn: async (): Promise<LandingWithClient | null> => {
      if (!slug) return null;
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("id, name, slug, logo_url, website")
        .eq("slug", slug)
        .maybeSingle();
      if (clientError) throw clientError;
      if (!client) return null;

      const { data: landing, error: landingError } = await supabase
        .from("client_landings")
        .select("*")
        .eq("client_id", client.id)
        .eq("enabled", true)
        .maybeSingle();
      if (landingError) throw landingError;
      if (!landing) return null;

      return { ...normalize(landing), client };
    },
  });
}

/** Landing for a specific client (admin or manager). */
export function useEditableLanding(clientId: string | undefined) {
  return useQuery({
    queryKey: ["landing", "editable", clientId],
    enabled: !!clientId,
    queryFn: async (): Promise<ClientLanding | null> => {
      if (!clientId) return null;
      const { data, error } = await supabase
        .from("client_landings")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data) : null;
    },
  });
}

/** All clients the current user can manage. */
export function useManagedClients() {
  return useQuery({
    queryKey: ["managed-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_managers")
        .select("client_id, clients(id, name, slug, logo_url)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? [])
        .map((r: any) => r.clients)
        .filter(Boolean) as Array<{
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
        }>;
    },
  });
}

/** Slugs of clients that have a published landing — for the sitemap and links. */
export function usePublishedLandingSlugs() {
  return useQuery({
    queryKey: ["landing", "published-slugs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_landings")
        .select("clients(slug)")
        .eq("enabled", true);
      if (error) throw error;
      return (data ?? [])
        .map((r: any) => r.clients?.slug)
        .filter((s: unknown): s is string => typeof s === "string");
    },
  });
}
