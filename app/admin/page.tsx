import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FolderKanban,
  Mail,
  PencilRuler,
  Users,
} from "lucide-react";
import { getDashboardStats, getCategoryLabels } from "@/lib/cms/queries";
import {
  applicationStatusClasses,
  applicationStatusLabels,
  isApplicationStatus,
} from "@/lib/recruitment";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminHomePage() {
  const [stats, labels] = await Promise.all([getDashboardStats(), getCategoryLabels()]);

  const cards = [
    { label: "Projets", value: stats.projects, hint: `${stats.publishedProjects} publiés`, href: "/admin/projets", icon: FolderKanban },
    { label: "Services", value: stats.services, hint: "Offre du cabinet", href: "/admin/services", icon: PencilRuler },
    { label: "Équipe", value: stats.team, hint: "Collaborateurs", href: "/admin/equipe", icon: Users },
    {
      label: "Messages",
      value: stats.messages + stats.reviews,
      hint: `${stats.messages} messages · ${stats.reviews} avis`,
      href: "/admin/messages",
      icon: Mail,
    },
    { label: "Recrutement", value: stats.applications, hint: `${stats.unreadApplications} non lus`, href: "/admin/recrutement", icon: Briefcase },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-[#00af84]">Administration</p>
        <h1 className="mt-1 text-3xl font-semibold text-[#065b48]">Tableau de bord</h1>
        <p className="mt-2 text-slate-500">Pilotez le contenu, les messages, les candidatures et les informations du cabinet.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#065b48] text-white">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-3xl font-semibold text-[#065b48]">{card.value}</p>
              <p className="font-medium text-slate-800">{card.label}</p>
              <p className="text-xs text-slate-500">{card.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#065b48]">Messages récents</h2>
            <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm text-[#00af84]">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {stats.recentMessages.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun message pour le moment.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentMessages.map((message) => (
                <li key={message.id} className="py-3">
                  <Link href={`/admin/messages/${message.id}`} className="block hover:text-[#00af84]">
                    <p className="flex items-center justify-between text-sm font-medium">
                      <span>{message.name}</span>
                      {!message.read ? (
                        <span className="rounded-full bg-[#00af84]/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#065b48]">
                          Nouveau
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">
                      {message.subject} · {formatDate(message.createdAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#065b48]">Candidatures récentes</h2>
            <Link href="/admin/recrutement" className="inline-flex items-center gap-1 text-sm text-[#00af84]">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {stats.recentApplications.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune candidature pour le moment.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentApplications.map((application) => {
                const status = isApplicationStatus(application.status) ? application.status : "nouveau";
                return (
                  <li key={application.id} className="py-3">
                    <Link href={`/admin/recrutement/${application.id}`} className="block hover:text-[#00af84]">
                      <p className="flex items-center justify-between gap-2 text-sm font-medium">
                        <span>
                          {application.firstName} {application.lastName}
                        </span>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", applicationStatusClasses[status])}>
                          {applicationStatusLabels[status]}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {application.position} · {formatDate(application.createdAt.toISOString())}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#065b48]">Projets</h2>
            <Link href="/admin/projets" className="inline-flex items-center gap-1 text-sm text-[#00af84]">
              Gérer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {stats.recentProjects.map((project) => (
              <li key={project.slug} className="py-3">
                <Link href={`/admin/projets/${project.slug}`} className="block hover:text-[#00af84]">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-slate-500">
                    {labels[project.category] ?? project.category} · {project.city} · {project.year}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
