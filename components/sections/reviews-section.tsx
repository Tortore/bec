"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Send, Star } from "lucide-react";

type PublicReview = {
  id: string;
  name: string;
  rating: number;
  message: string;
};

export function ReviewsSection({ reviews }: { reviews: PublicReview[] }) {
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          rating,
          message: data.get("message"),
          privacy: data.get("privacy") === "on",
          website: data.get("website"),
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Envoi impossible.");
      form.reset();
      setRating(5);
      setStatus("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Envoi impossible.");
      setStatus("error");
    }
  }

  return (
    <section className="bg-[#f7f9f8] py-16 md:py-24" id="avis">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#00af84]/10 px-4 py-1.5 text-sm font-semibold text-[#065b48]">
            Avis et opinions
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#065b48] md:text-4xl">
            Partagez votre expérience avec BEC
          </h2>
          <p className="mt-4 text-muted-foreground">
            Votre opinion nous aide à améliorer nos services et à mieux accompagner chaque projet.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div className="space-y-4">
            {reviews.length ? (
              reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-[#00af84]/15 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-1 text-amber-500" aria-label={`${review.rating} étoiles sur 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-300"}`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="mt-4 leading-7 text-slate-700">“{review.message}”</p>
                  <p className="mt-4 text-sm font-semibold text-[#065b48]">{review.name}</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#00af84]/30 bg-white p-8 text-center text-muted-foreground">
                Soyez la première personne à partager votre avis.
              </div>
            )}
          </div>

          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm md:p-8">
            {status === "success" ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#00af84]" aria-hidden />
                <h3 className="mt-4 text-xl font-bold text-[#065b48]">Merci pour votre avis</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Il sera affiché sur le site après sa validation par BEC.
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-lg bg-[#065b48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00af84]"
                  onClick={() => setStatus("idle")}
                >
                  Ajouter un autre avis
                </button>
              </div>
            ) : (
              <form onSubmit={submitReview} className="space-y-5" noValidate>
                <h3 className="text-xl font-bold text-[#065b48]">Donnez votre avis</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Nom complet *</span>
                    <input
                      name="name"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      className="h-11 w-full rounded-md border border-input bg-white px-3 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>E-mail *</span>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={160}
                      autoComplete="email"
                      className="h-11 w-full rounded-md border border-input bg-white px-3 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                </div>
                <fieldset>
                  <legend className="text-sm font-medium text-slate-700">Votre note *</legend>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          className="rounded p-1 text-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00af84]"
                          onClick={() => setRating(value)}
                          aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                          aria-pressed={rating === value}
                        >
                          <Star className={`h-7 w-7 ${value <= rating ? "fill-current" : "text-slate-300"}`} />
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Votre avis *</span>
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={1000}
                    rows={5}
                    placeholder="Partagez votre expérience ou vos suggestions…"
                    className="w-full rounded-md border border-input bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <input name="privacy" type="checkbox" required className="mt-1" />
                  <span>
                    J’accepte le traitement de mes données conformément à la{" "}
                    <Link href="/confidentialite" className="font-medium text-[#065b48] hover:text-[#00af84]">
                      politique de confidentialité
                    </Link>
                    . Mon e-mail ne sera pas affiché.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00af84] px-5 py-3 text-sm font-semibold text-white hover:bg-[#065b48] disabled:cursor-wait disabled:opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {status === "sending" ? "Envoi…" : "Envoyer mon avis"}
                </button>
                {status === "error" ? <p className="text-sm text-red-700">{error}</p> : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
