"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn, isPublicHttpUrl, needsUnoptimizedImage, runtimeMediaUrl } from "@/lib/utils";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function SiteImage({
  src,
  alt,
  priority,
  loading,
  className,
  fill,
  unoptimized,
  ...props
}: SiteImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span
        className={cn("bg-neutral-200", fill && "absolute inset-0", className)}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      />
    );
  }

  const displaySrc = src.startsWith("/uploads/") || isPublicHttpUrl(src) ? runtimeMediaUrl(src) : src;

  return (
    <Image
      src={displaySrc}
      alt={alt}
      fill={fill}
      priority={priority}
      loading={priority ? "eager" : (loading ?? "lazy")}
      className={className}
      unoptimized={unoptimized ?? (needsUnoptimizedImage(src) || isPublicHttpUrl(displaySrc))}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
