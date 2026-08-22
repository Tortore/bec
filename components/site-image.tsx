"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn, runtimeMediaUrl } from "@/lib/utils";

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
  const uploaded = src.startsWith("/uploads/");

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

  return (
    <Image
      src={runtimeMediaUrl(src)}
      alt={alt}
      fill={fill}
      priority={priority}
      loading={priority ? "eager" : (loading ?? "lazy")}
      className={className}
      unoptimized={unoptimized ?? uploaded}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
