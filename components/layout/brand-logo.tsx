import { SiteImage } from "@/components/site-image";
import { defaultFooter } from "@/lib/cms/footer-content";
import { cn } from "@/lib/utils";

export function BrandLogo({
  src = defaultFooter.logo,
  className,
  sizes,
  priority = false,
}: {
  src?: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const image = src?.trim() || defaultFooter.logo;
  const knockout = /LOGOBLANC/i.test(image);
  return (
    <SiteImage
      src={image}
      alt=""
      fill
      className={cn(
        "object-contain",
        knockout ? "scale-125 mix-blend-screen" : "p-1",
        className,
      )}
      sizes={sizes}
      priority={priority}
    />
  );
}
