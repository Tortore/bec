import { cn } from "@/lib/utils";
import { richTextToPlainText, sanitizeRichText } from "@/lib/rich-text";

export function RichText({ content, className }: { content: string; className?: string }) {
  const html = sanitizeRichText(content);
  if (!richTextToPlainText(html)) return null;

  return (
    <div
      className={cn(
        "space-y-3 leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-[#00af84] [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#065b48] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#065b48] [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:font-bold [&_ul]:list-disc",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
