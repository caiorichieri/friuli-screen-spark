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
