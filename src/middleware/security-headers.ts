import { createMiddleware } from "@tanstack/react-start";

export const securityHeadersMiddleware = createMiddleware({
  type: "request",
}).server(async ({ next, request }) => {
  const result = await next();
  const headers = new Headers(result.response.headers);

  // Skip X-Frame-Options on the Lovable preview host so the editor iframe can render the app.
  const host = (() => {
    try {
      return new URL(request.url).hostname;
    } catch {
      return "";
    }
  })();
  const isPreview = host.includes("id-preview--") || host === "localhost" || host.startsWith("127.");

  if (!isPreview) {
    headers.set("X-Frame-Options", "SAMEORIGIN");
  }
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  return {
    ...result,
    response: new Response(result.response.body, {
      status: result.response.status,
      statusText: result.response.statusText,
      headers,
    }),
  };
});
