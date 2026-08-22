import type { Metadata } from "next";
import { after } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { deleteMessageAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/auth";
import { markContactMessageRead } from "@/lib/cms/queries";
import { getMessages } from "@/lib/cms/store";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Message" };

export default async function AdminMessagePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const message = (await getMessages()).find((item) => item.id === id);
  if (!message) notFound();
  if (!message.read) {
    after(() => markContactMessageRead(id));
  }

  return (
    <div>
      <AdminHeader title={message.subject} description={`${message.name} · ${formatDate(message.createdAt)}`} />
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-slate-500">Nom</dt>
            <dd className="font-medium">{message.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">E-mail</dt>
            <dd>
              <a className="text-[#065b48] hover:underline" href={`mailto:${message.email}`}>
                {message.email}
              </a>
            </dd>
          </div>
          {message.phone ? (
            <div>
              <dt className="text-slate-500">Téléphone</dt>
              <dd>
                <a className="text-[#065b48] hover:underline" href={`tel:${message.phone}`}>
                  {message.phone}
                </a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-slate-500">Sujet</dt>
            <dd className="font-medium">{message.subject}</dd>
          </div>
        </dl>
        <p className="mt-6 whitespace-pre-wrap leading-relaxed text-slate-700">{message.message}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
            className="rounded-xl bg-[#00af84] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#065b48]"
          >
            Répondre par e-mail
          </Link>
          <ConfirmDelete
            message="Supprimer ce message ?"
            action={deleteMessageAction.bind(null, id)}
          />
        </div>
      </article>
    </div>
  );
}
