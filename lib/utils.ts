import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export {
  encodeImagePath,
  isPublicHttpUrl,
  mediaFileName,
  needsUnoptimizedImage,
  runtimeMediaUrl,
} from "@/lib/media-url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string, locale = "fr-FR") {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function whatsappLink(phone: string, message?: string) {
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
