import { createMiddleware } from "@tanstack/react-start";

export const securityHeadersMiddleware = createMiddleware({
  type: "request",
}).server(async ({ next }) => {
  const result = await next();
  const headers = new Headers(result.response.headers);
  headers.set("X-Frame-Options", "SAMEORIGIN");
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
