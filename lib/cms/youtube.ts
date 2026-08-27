const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;
const LOCAL_VIDEO = /\.(mp4|webm|mov|m4v)$/i;

export type YouTubeRef = {
  id: string;
  start?: number;
};

function parseStart(value: string | null) {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    return seconds > 0 ? seconds : undefined;
  }
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return undefined;
  const seconds =
    Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
  return seconds > 0 ? seconds : undefined;
}

export function parseYouTube(raw: string): YouTubeRef | null {
  const value = raw.trim();
  if (!value) return null;
  if (YOUTUBE_ID.test(value)) return { id: value };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./i, "").replace(/^m\./i, "").toLowerCase();
  if (
    host !== "youtu.be" &&
    host !== "youtube.com" &&
    host !== "youtube-nocookie.com"
  ) {
    return null;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  let id = url.searchParams.get("v") || "";
  if (host === "youtu.be") id = parts[0] || id;
  else if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") id = parts[1] || id;

  if (!YOUTUBE_ID.test(id)) return null;
  const start = parseStart(url.searchParams.get("start") || url.searchParams.get("t"));
  return start ? { id, start } : { id };
}

export function isLocalProjectVideo(src: string) {
  const value = src.trim();
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("..") &&
    LOCAL_VIDEO.test(value)
  );
}

export function normalizeProjectVideo(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (parseYouTube(value)) return value;
  if (isLocalProjectVideo(value)) return value;
  return null;
}

export function youtubePoster(id: string, quality: "max" | "hq" = "max") {
  return quality === "max"
    ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(ref: YouTubeRef, autoplay = false) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    cc_load_policy: "0",
  });
  if (autoplay) params.set("autoplay", "1");
  if (ref.start) params.set("start", String(ref.start));
  return `https://www.youtube-nocookie.com/embed/${ref.id}?${params.toString()}`;
}
