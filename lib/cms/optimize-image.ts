import path from "path";
import sharp from "sharp";

export const maxPhotoEdge = 1920;
export const logoEdge = 512;
export const photoQuality = 80;

const animated = new Set([".gif"]);

export async function optimizeUpload(input: Buffer, filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (animated.has(ext)) {
    return { buffer: input, ext };
  }

  const buffer = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: maxPhotoEdge,
      height: maxPhotoEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: photoQuality, effort: 4 })
    .toBuffer();

  return { buffer, ext: ".webp" };
}

export async function compressExistingFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (animated.has(ext)) return { skipped: true, before: 0, after: 0 };

  const isLogo = filePath.includes(`${path.sep}logo${path.sep}`);
  const edge = isLogo ? logoEdge : maxPhotoEdge;
  const image = sharp(filePath, { failOn: "none" }).rotate().resize({
    width: edge,
    height: edge,
    fit: "inside",
    withoutEnlargement: true,
  });

  let output: Buffer;
  if (ext === ".png") {
    output = await image.png({ compressionLevel: 9 }).toBuffer();
  } else if (ext === ".webp") {
    output = await image.webp({ quality: photoQuality, effort: 4 }).toBuffer();
  } else {
    output = await image.jpeg({ quality: photoQuality, mozjpeg: true, progressive: true }).toBuffer();
  }

  return { skipped: false, buffer: output };
}
