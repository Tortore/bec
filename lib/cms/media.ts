import { promises as fs } from "fs";
import path from "path";
import { slugify } from "@/lib/cms/slug";
import { optimizeUpload } from "@/lib/cms/optimize-image";

const imageExt = /\.(jpe?g|png|webp|avif|gif)$/i;

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
