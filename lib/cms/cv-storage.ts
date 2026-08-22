import { promises as fs } from "fs";
import path from "path";
import {
  isAllowedCvName,
  isAllowedIdentityName,
  MAX_APPLICATION_BYTES,
} from "@/lib/recruitment";

const storageDir = path.join(process.cwd(), "storage", "candidatures");
const storedNamePattern = /^(cv|id)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;

type FileKind = "cv" | "id";

const mimeByExt: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".rtf": "application/rtf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function extensionOf(name: string) {
  const ext = path.extname(name).toLowerCase();
  return ext === ".jpeg" ? ".jpg" : ext;
}

function head(buffer: Buffer, length = 16) {
  return buffer.subarray(0, Math.min(buffer.length, length));
}

function looksLikePdf(buffer: Buffer) {
  const start = buffer.subarray(0, Math.min(buffer.length, 2048)).toString("latin1");
  return start.includes("%PDF");
}

function looksLikeZip(buffer: Buffer) {
  return buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function looksLikeOle(buffer: Buffer) {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0xd0 &&
    buffer[1] === 0xcf &&
    buffer[2] === 0x11 &&
    buffer[3] === 0xe0
  );
}

function looksLikeRtf(buffer: Buffer) {
  const start = buffer.subarray(0, Math.min(buffer.length, 64)).toString("latin1");
  return start.includes("{\\rtf");
}

function looksLikeJpeg(buffer: Buffer) {
  const slice = head(buffer, 32);
  for (let i = 0; i < slice.length - 2; i += 1) {
    if (slice[i] === 0xff && slice[i + 1] === 0xd8 && slice[i + 2] === 0xff) return true;
  }
  return false;
}

function looksLikePng(buffer: Buffer) {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  );
}

function looksLikeWebp(buffer: Buffer) {
  if (buffer.length < 12) return false;
  const riff = buffer.subarray(0, 4).toString("ascii");
  const webp = buffer.subarray(8, 12).toString("ascii");
  return riff === "RIFF" && webp === "WEBP";
}

function magicMatches(buffer: Buffer, ext: string) {
  if (ext === ".pdf") return looksLikePdf(buffer);
  if (ext === ".docx" || ext === ".odt") return looksLikeZip(buffer);
  if (ext === ".doc") return looksLikeOle(buffer) || looksLikeZip(buffer);
  if (ext === ".rtf") return looksLikeRtf(buffer);
  if (ext === ".jpg") return looksLikeJpeg(buffer);
  if (ext === ".png") return looksLikePng(buffer);
  if (ext === ".webp") return looksLikeWebp(buffer);
  return false;
}

function sniffExtension(buffer: Buffer, kind: FileKind): string | null {
  if (looksLikePdf(buffer)) return ".pdf";
  if (kind === "id") {
    if (looksLikeJpeg(buffer)) return ".jpg";
    if (looksLikePng(buffer)) return ".png";
    if (looksLikeWebp(buffer)) return ".webp";
  }
  if (kind === "cv") {
    if (looksLikeRtf(buffer)) return ".rtf";
    if (looksLikeOle(buffer)) return ".doc";
    if (looksLikeZip(buffer)) return ".docx";
  }
  return null;
}

function sanitizeOriginalName(name: string) {
  const base = path.basename(name).replace(/[^\w.\- ()àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ]+/g, "_");
  return base.slice(0, 160) || "document";
}

export function detectApplicationFile(buffer: Buffer, originalName: string, kind: FileKind) {
  const allowedByName = kind === "cv" ? isAllowedCvName(originalName) : isAllowedIdentityName(originalName);
  let ext = extensionOf(originalName);

  if (allowedByName && magicMatches(buffer, ext)) {
    if (ext === ".doc" && looksLikeZip(buffer)) ext = ".docx";
  } else {
    const sniffed = sniffExtension(buffer, kind);
    if (!sniffed) return null;
    ext = sniffed;
    const allowedBySniff = kind === "cv" ? isAllowedCvName(`file${ext}`) : isAllowedIdentityName(`file${ext}`);
    if (!allowedBySniff && !(kind === "id" && ext === ".webp")) return null;
  }

  return {
    ext,
    mimeType: mimeByExt[ext] ?? "application/octet-stream",
    fileName: sanitizeOriginalName(originalName || `document${ext}`),
  };
}

export async function saveApplicationFile(file: File, kind: FileKind) {
  if (file.size <= 0 || file.size > MAX_APPLICATION_BYTES) {
    throw new Error("SIZE");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_APPLICATION_BYTES) {
    throw new Error("SIZE");
  }
  const detected = detectApplicationFile(buffer, file.name, kind);
  if (!detected) {
    throw new Error("FORMAT");
  }
  await fs.mkdir(storageDir, { recursive: true });
  const storedName = `${kind}-${crypto.randomUUID()}${detected.ext}`;
  await fs.writeFile(path.join(storageDir, storedName), buffer);
  return {
    fileName: detected.fileName,
    storedName,
    mimeType: detected.mimeType,
    size: buffer.length,
  };
}

export function resolveStoredFile(storedName: string) {
  if (!storedNamePattern.test(storedName)) {
    throw new Error("FORBIDDEN");
  }
  const root = path.resolve(storageDir);
  const full = path.resolve(root, storedName);
  if (full !== root && !full.startsWith(root + path.sep)) {
    throw new Error("FORBIDDEN");
  }
  return full;
}

export async function readStoredFile(storedName: string) {
  return fs.readFile(resolveStoredFile(storedName));
}

export async function storedFileExists(storedName: string | null | undefined) {
  if (!storedName) return false;
  try {
    await fs.access(resolveStoredFile(storedName));
    return true;
  } catch {
    return false;
  }
}

export async function deleteStoredFile(storedName: string | null | undefined) {
  if (!storedName) return;
  try {
    await fs.unlink(resolveStoredFile(storedName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
