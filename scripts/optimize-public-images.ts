import { promises as fs } from "fs";
import path from "path";
import { compressExistingFile } from "../lib/cms/optimize-image";

const roots = [
  path.join(process.cwd(), "public", "images"),
  path.join(process.cwd(), "public", "uploads"),
];
const imageExt = /\.(jpe?g|png|webp)$/i;

async function walk(dir: string, acc: string[]) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, String(entry.name));
    if (entry.isDirectory()) await walk(full, acc);
    else if (imageExt.test(String(entry.name))) acc.push(full);
  }
}

async function writeFavicons() {
  const sharp = (await import("sharp")).default;
  const source = path.join(process.cwd(), "public", "images", "logo", "LOGO VERT.png.jpg");
  await sharp(source, { failOn: "none" })
    .rotate()
    .resize(32, 32, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(process.cwd(), "public", "favicon.png"));
  await sharp(source, { failOn: "none" })
    .rotate()
    .resize(180, 180, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(process.cwd(), "public", "apple-touch-icon.png"));
}

async function main() {
  const files: string[] = [];
  for (const root of roots) await walk(root, files);
  let saved = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const before = (await fs.stat(file)).size;
    beforeTotal += before;
    const result = await compressExistingFile(file);
    if (result.skipped || !result.buffer || result.buffer.length >= before) {
      afterTotal += before;
      continue;
    }
    await fs.writeFile(file, result.buffer);
    afterTotal += result.buffer.length;
    saved += before - result.buffer.length;
    console.log(
      `${path.relative(process.cwd(), file)} ${(before / 1024).toFixed(0)}k → ${(result.buffer.length / 1024).toFixed(0)}k`,
    );
  }

  await writeFavicons();
  console.log(
    `\n${files.length} images. ${(beforeTotal / 1024 / 1024).toFixed(1)} Mo → ${(afterTotal / 1024 / 1024).toFixed(1)} Mo (−${(saved / 1024 / 1024).toFixed(1)} Mo)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
