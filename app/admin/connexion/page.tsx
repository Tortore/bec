import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/cms/auth";
import { getSettings } from "@/lib/cms/queries";
import { LoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/layout/brand-logo";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#044a3a] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <span className="relative mx-auto flex h-16 w-16 overflow-hidden rounded-2xl bg-[#044a3a]">
            <BrandLogo src={settings.footer.logo} sizes="64px" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-[#065b48]">Administration {settings.footer.brandName}</h1>
          <p className="mt-1 text-sm text-slate-500">Espace réservé à l’équipe du cabinet</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
