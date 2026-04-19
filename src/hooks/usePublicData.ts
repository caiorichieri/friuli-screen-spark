import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PublicClient = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  sort_order: number;
};

export type PublicService = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  category_id: string | null;
  sort_order: number;
};

export type PortfolioCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type PublicProject = {
  id: string;
  title: string;
  slug: string | null;
  cover_image_url: string | null;
  gallery: string[];
  year: number | null;
  tags: string[];
  external_url: string | null;
  portfolio_category_id: string | null;
  public_summary: string | null;
  description: string | null;
  public_sort_order: number;
  client_id: string;
  clients: { name: string } | null;
};

export function usePublicClients() {
  return useQuery({
    queryKey: ["clients", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, slug, logo_url, website, sort_order")
        .eq("is_public", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PublicClient[];
    },
  });
}

export function usePublicServices() {
  return useQuery({
    queryKey: ["services", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, title, slug, description, icon, category_id, sort_order")
        .eq("is_public", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PublicService[];
    },
  });
}

export function usePortfolioCategories() {
  return useQuery({
    queryKey: ["portfolio-categories", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_categories")
        .select("id, name, slug, sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PortfolioCategory[];
    },
  });
}

export function usePublicProjects() {
  return useQuery({
    queryKey: ["projects", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, slug, cover_image_url, gallery, year, tags, external_url, portfolio_category_id, public_summary, description, public_sort_order, client_id, clients(name)",
        )
        .eq("is_public", true)
        .order("public_sort_order", { ascending: true })
        .order("year", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []).map((p) => ({
        ...p,
        gallery: Array.isArray(p.gallery) ? (p.gallery as string[]) : [],
      })) as PublicProject[];
    },
  });
}
