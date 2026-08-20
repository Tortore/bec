import type { TeamMember } from "@/types";
import { SiteImage } from "@/components/site-image";
import { cn } from "@/lib/utils";

export function TeamPhoto({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#065b48]", className)}>
      <SiteImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain object-bottom"
      />
    </div>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <TeamPhoto
        src={member.image}
        alt={member.name}
        className="h-64 transition-transform duration-500 group-hover:scale-[1.03] sm:h-72"
      />
      <div className="p-5 text-center">
        <h3 className="font-bold text-[#065b48]">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold text-[#00af84]">{member.role}</p>
        <p className="mt-2 text-sm text-muted-foreground">{member.specialty}</p>
      </div>
    </article>
  );
}
