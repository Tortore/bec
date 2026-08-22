import type { Metadata } from "next";
import { getAdminSession } from "@/lib/cms/auth";
import { getPendingReviewsCount, getUnreadApplicationsCount } from "@/lib/cms/queries";
import { getMessages } from "@/lib/cms/store";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s | Admin BEC",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) return children;
  const unread = (await getMessages()).filter((item) => !item.read).length;
  const unreadApplications = await getUnreadApplicationsCount();
  const unreadReviews = await getPendingReviewsCount();
  return (
    <AdminShell
      user={session.user}
      unread={unread}
      unreadApplications={unreadApplications}
      unreadReviews={unreadReviews}
    >
      {children}
    </AdminShell>
  );
}
