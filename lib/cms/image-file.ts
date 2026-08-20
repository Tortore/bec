const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const allowedName = /\.(jpe?g|png|webp|avif|gif)$/i;
export const maxImageBytes = 8 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!allowedTypes.has(file.type) && !allowedName.test(file.name)) {
    return "Formats acceptés : JPG, PNG, WEBP, AVIF ou GIF.";
  }
  if (file.size > maxImageBytes) {
    return "L’image ne doit pas dépasser 8 Mo.";
  }
  return null;
}
