import type { Metadata } from "next";
import { getAdminSession } from "@/lib/cms/auth";
import { getPendingReviewsCount, getSettings, getUnreadApplicationsCount } from "@/lib/cms/queries";
import { getOpenLogsCount } from "@/lib/cms/logs";
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
  const [unreadMessages, unreadApplications, unreadReviews, openLogs, settings] = await Promise.all([
    getMessages(),
    getUnreadApplicationsCount(),
    getPendingReviewsCount(),
    getOpenLogsCount(),
    getSettings(),
  ]);
  const unread = unreadMessages.filter((item) => !item.read).length;
  return (
    <AdminShell
      user={session.user}
      unread={unread}
      unreadApplications={unreadApplications}
      unreadReviews={unreadReviews}
      openLogs={openLogs}
      logo={settings.footer.logo}
      brandName={settings.footer.brandName}
      brandSubtitle={settings.footer.brandSubtitle}
    >
      {children}
    </AdminShell>
  );
}
