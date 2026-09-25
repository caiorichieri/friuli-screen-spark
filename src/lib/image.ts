/** Returns a resized, compressed (WebP when supported) version of a stored image URL. */
export function optimizedImage(url: string | null | undefined, width: number, quality = 70): string {
  if (!url) return "";
  if (!url.includes("/storage/v1/object/public/")) return url;
  const base = url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}width=${width}&quality=${quality}&resize=contain`;
}
