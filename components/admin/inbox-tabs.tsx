import Link from "next/link";
import { cn } from "@/lib/utils";

export function InboxTabs({
  current,
  messagesCount,
  unreadMessages,
  reviewsCount,
  pendingReviews,
}: {
  current: "contact" | "avis";
  messagesCount: number;
  unreadMessages: number;
  reviewsCount: number;
  pendingReviews: number;
}) {
  const tabs = [
    {
      id: "contact" as const,
      href: "/admin/messages",
      label: `Messages de contact (${messagesCount})`,
      badge: unreadMessages,
    },
    {
      id: "avis" as const,
      href: "/admin/messages?onglet=avis",
      label: `Avis (${reviewsCount})`,
      badge: pendingReviews,
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
            current === tab.id ? "bg-[#065b48] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200",
          )}
        >
          {tab.label}
          {tab.badge > 0 ? (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                current === tab.id ? "bg-white/20 text-white" : "bg-[#00af84]/15 text-[#065b48]",
              )}
            >
              {tab.badge}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
