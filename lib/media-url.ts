export function isPublicHttpUrl(href: string) {
  return /^https?:\/\//i.test(href.trim());
}

export function mediaFileName(src: string) {
  return decodeURIComponent(src.split("/").pop() ?? src);
}

export function encodeImagePath(src: string) {
  return src
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
    .replace(/%2F/g, "/");
}

export function runtimeMediaUrl(src: string) {
  const value = src.trim();
  if (!value) return value;
  if (isPublicHttpUrl(value)) return value;
  if (value.startsWith("/uploads/")) {
    const relative = value
      .slice("/uploads/".length)
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `/api/media/${relative}`;
  }
  if (value.startsWith("/")) return encodeImagePath(value);
  return value;
}

export function needsUnoptimizedImage(src: string) {
  return (
    isPublicHttpUrl(src) ||
    src.startsWith("/uploads/") ||
    src.startsWith("/api/") ||
    /[\s()%]/.test(src)
  );
}
