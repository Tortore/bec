import { promises as fs } from "fs";
import path from "path";
import { slugify } from "@/lib/cms/slug";
import { optimizeUpload } from "@/lib/cms/optimize-image";

const imageExt = /\.(jpe?g|png|webp|avif|gif)$/i;
const videoExt = /\.(mp4|webm|mov|m4v)$/i;

async function walk(dir: string, acc: string[]) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, String(entry.name));
    if (entry.isDirectory()) {
      await walk(full, acc);
    } else if (imageExt.test(String(entry.name))) {
      const relative = path.relative(path.join(process.cwd(), "public"), full).replaceAll("\\", "/");
      acc.push(`/${relative}`);
    }
  }
}

export async function listMedia() {
  const files: string[] = [];
  await walk(path.join(process.cwd(), "public", "images"), files);
  await walk(path.join(process.cwd(), "public", "uploads"), files);
  return files.sort((a, b) => a.localeCompare(b, "fr"));
}

async function walkVideos(dir: string, acc: string[]) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, String(entry.name));
    if (entry.isDirectory()) {
      await walkVideos(full, acc);
    } else if (videoExt.test(String(entry.name))) {
      const relative = path.relative(path.join(process.cwd(), "public"), full).replaceAll("\\", "/");
      acc.push(`/${relative}`);
    }
  }
}

export async function listVideos() {
  const files: string[] = [];
  await walkVideos(path.join(process.cwd(), "public", "videos"), files);
  await walkVideos(path.join(process.cwd(), "public", "uploads"), files);
  return files.sort((a, b) => a.localeCompare(b, "fr"));
}

export async function saveUpload(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (!imageExt.test(ext)) {
    throw new Error("FORMAT");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("SIZE");
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const original = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeUpload(original, file.name);
  const base = slugify(path.basename(file.name, ext)) || "image";
  const name = `${base}-${Date.now()}${optimized.ext}`;
  await fs.writeFile(path.join(dir, name), optimized.buffer);
  return `/uploads/${name}`;
}

export async function saveVideoUpload(file: File) {
  const originalExt = path.extname(file.name).toLowerCase();
  let ext = originalExt === ".m4v" ? ".mp4" : originalExt;
  const allowedTypes = new Set([
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-m4v",
    "application/octet-stream",
    "",
  ]);
  if (!videoExt.test(file.name) && !allowedTypes.has(file.type)) {
    throw new Error("FORMAT");
  }
  if (!allowedTypes.has(file.type)) {
    throw new Error("FORMAT");
  }
  if (!ext || !videoExt.test(ext === ".mp4" ? ".mp4" : ext)) {
    if (file.type === "video/webm") ext = ".webm";
    else if (file.type === "video/quicktime") ext = ".mov";
    else ext = ".mp4";
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("SIZE");
  }
  if (file.size === 0) {
    throw new Error("FORMAT");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const isWebm = bytes.length >= 4 && bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  const isIsoMedia = bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp";
  if (!isWebm && !isIsoMedia) {
    throw new Error("FORMAT");
  }
  ext = isWebm ? ".webm" : ext === ".mov" ? ".mov" : ".mp4";
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const base = slugify(path.basename(file.name, originalExt || ext)) || "video";
  const name = `${base}-${Date.now()}${ext}`;
  await fs.writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

export function isUploadedMedia(src: string) {
  return src.startsWith("/uploads/") && !src.includes("..") && imageExt.test(src);
}

export async function deleteUpload(src: string) {
  if (!isUploadedMedia(src)) {
    throw new Error("FORBIDDEN");
  }
  const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");
  const full = path.resolve(process.cwd(), "public", src.replace(/^\//, ""));
  const inside = full === uploadsRoot || full.startsWith(uploadsRoot + path.sep);
  if (!inside) {
    throw new Error("FORBIDDEN");
  }
  await fs.unlink(full);
}
