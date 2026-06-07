/**
 * Sanitize a user-supplied URL before using it in href/src.
 * Blocks javascript:, data:, vbscript:, file: and other dangerous schemes.
 * Returns "#" for invalid or disallowed URLs.
 */
const ALLOWED_PROTOCOLS = new Set(["https:", "http:", "mailto:", "tel:"]);

export function safeHref(url: string | null | undefined): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (!trimmed) return "#";
  // Allow same-origin relative paths
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const parsed = new URL(trimmed, "https://placeholder.invalid");
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return "#";
    return trimmed;
  } catch {
    return "#";
  }
}

export function isSafeUrl(url: string | null | undefined): boolean {
  return safeHref(url) !== "#";
}
