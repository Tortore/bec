import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatDate(isoDate: string, locale = "fr-FR") {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isPublicHttpUrl(href: string) {
  return /^https?:\/\//i.test(href.trim());
}

export function whatsappLink(phone: string, message?: string) {
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
