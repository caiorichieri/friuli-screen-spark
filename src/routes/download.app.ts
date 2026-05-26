import { createFileRoute } from "@tanstack/react-router";

const APK_URL =
  "https://jgxuweezpxqpihtajnwt.supabase.co/storage/v1/object/public/downloads/friulion.apk";

export const Route = createFileRoute("/download/app")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, {
          status: 302,
          headers: {
            Location: APK_URL,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
