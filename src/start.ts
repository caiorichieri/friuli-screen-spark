import { createStart } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { securityHeadersMiddleware } from "@/middleware/security-headers";

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeadersMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
