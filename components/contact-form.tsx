"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, FileText, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { contactEndpoint } from "@/lib/env";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";

const subjects = [
  "Demande de devis",
  "Conception architecturale",
  "Design intérieur",
  "Gestion de projet",
  "Urbanisme",
  "Études techniques",
  "Suivi de chantier",
  "Autre",
];

export function ContactForm({ defaultSubject = "Demande de devis" }: { defaultSubject?: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: defaultSubject,
      message: "",
      privacy: false,
    },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("idle");
    setErrorMessage("");
    try {
      const response = await fetchWithTimeout(contactEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }, 20_000);
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "L’envoi a échoué.");
      setStatus("success");
      reset({ name: "", email: "", phone: "", subject: defaultSubject, message: "", privacy: false });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof RequestTimeoutError
          ? "Le serveur met trop de temps à répondre. Vérifiez votre connexion puis réessayez."
          : error instanceof Error
            ? error.message
            : "L’envoi a échoué. Réessayez, ou écrivez-nous directement.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#00af84]/25 bg-[#00af84]/5 p-8 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-[#00af84]" aria-hidden />
        <h3 className="mt-4 text-xl font-bold text-[#065b48]">Message envoyé</h3>
        <p className="mt-2 text-muted-foreground">
          Merci. Votre message a bien été transmis à BEC. Nous vous répondons aux
          horaires d&apos;ouverture.
        </p>
        <Button type="button" className="mt-6" onClick={() => setStatus("idle")}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="name"
              className="pl-10"
              placeholder="Votre nom"
              autoComplete="name"
              {...register("name")}
            />
          </div>
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="email"
              type="email"
              className="pl-10"
              placeholder="votre@email.com"
              autoComplete="email"
              {...register("email")}
            />
          </div>
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="phone"
              className="pl-10"
              placeholder="+243 ..."
              autoComplete="tel"
              {...register("phone")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet *</Label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <select
              id="subject"
              className="flex h-12 w-full appearance-none rounded-md border border-input bg-card px-4 py-2 pl-10 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
              {...register("subject")}
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {errors.subject ? <p className="text-sm text-destructive">{errors.subject.message}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden />
          <Textarea
            id="message"
            className="pl-10"
            placeholder="Décrivez votre projet ou votre demande..."
            {...register("message")}
          />
        </div>
        {errors.message ? <p className="text-sm text-destructive">{errors.message.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1" {...register("privacy")} />
          <span>
            J’accepte que BEC traite mes données pour répondre à cette demande, conformément à la{" "}
            <Link href="/confidentialite" className="font-medium text-[#065b48] hover:text-[#00af84]">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        {errors.privacy ? <p className="text-sm text-destructive">{errors.privacy.message}</p> : null}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
        {isSubmitting ? (
          "Envoi en cours..."
        ) : (
          <>
            <Send className="h-4 w-4" />
            Envoyer le message
          </>
        )}
      </Button>
      {status === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage} Vous pouvez aussi écrire à bec@gmail.com.
        </p>
      ) : null}
    </form>
  );
}
