"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Briefcase,
  CheckCircle,
  FileText,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Send,
  Upload,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applicationFieldsSchema } from "@/lib/application-schema";
import { recruitmentEndpoint } from "@/lib/env";
import { fetchWithTimeout, RequestTimeoutError } from "@/lib/fetch-with-timeout";
import {
  acceptAttribute,
  careerPositions,
  cvExtensions,
  educationLevels,
  experienceLevels,
  formatFileSize,
  identityExtensions,
  isAllowedCvName,
  isAllowedIdentityName,
  MAX_APPLICATION_BYTES,
} from "@/lib/recruitment";
import { cn } from "@/lib/utils";

const applicationFormSchema = applicationFieldsSchema.extend({
  cv: z
    .custom<File>((value) => value instanceof File && value.size > 0, {
      message: "Joignez votre CV.",
    })
    .refine((file) => file.size <= MAX_APPLICATION_BYTES, {
      message: "Le CV ne doit pas dépasser 8 Mo.",
    })
    .refine((file) => isAllowedCvName(file.name), {
      message: "Formats acceptés : PDF, Word, ODT, RTF.",
    }),
  identityDoc: z
    .custom<File | undefined>((value) => value === undefined || value instanceof File)
    .optional()
    .refine((file) => !file || file.size <= MAX_APPLICATION_BYTES, {
      message: "La pièce d’identité ne doit pas dépasser 8 Mo.",
    })
    .refine((file) => !file || isAllowedIdentityName(file.name), {
      message: "Formats acceptés : PDF, JPG ou PNG.",
    }),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

function FileDrop({
  id,
  label,
  hint,
  accept,
  file,
  required,
  error,
  onFile,
  onClear,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  file?: File;
  required?: boolean;
  error?: string;
  onFile: (file: File | undefined) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " *" : " (facultatif)"}
      </Label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#00af84]/30 bg-[#00af84]/5 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#065b48]">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-red-600"
            aria-label="Retirer le fichier"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              onClear();
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            onFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
            dragOver
              ? "border-[#00af84] bg-[#00af84]/10"
              : "border-slate-200 bg-slate-50 hover:border-[#00af84]/50 hover:bg-[#00af84]/5",
          )}
        >
          <Upload className="h-8 w-8 text-[#00af84]" aria-hidden />
          <p className="mt-3 text-sm font-medium text-[#065b48]">
            Touchez pour joindre un fichier
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </button>
      )}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      position: "Candidature spontanée",
      experience: "1 à 3 ans",
      education: "Licence / Bac+3",
      message: "",
      privacy: false,
    },
  });

  const cv = watch("cv");
  const identityDoc = watch("identityDoc");

  async function onSubmit(values: ApplicationFormValues) {
    setStatus("idle");
    setServerError("");
    const body = new FormData();
    body.set("firstName", values.firstName);
    body.set("lastName", values.lastName);
    body.set("email", values.email);
    body.set("phone", values.phone);
    body.set("city", values.city);
    body.set("position", values.position);
    body.set("experience", values.experience);
    body.set("education", values.education);
    body.set("message", values.message);
    body.set("privacy", String(values.privacy));
    body.set("cv", values.cv);
    if (values.identityDoc) body.set("identityDoc", values.identityDoc);

    try {
      const response = await fetchWithTimeout(
        recruitmentEndpoint(),
        { method: "POST", body, credentials: "same-origin" },
        90_000,
      );
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setServerError(payload?.error || "L’envoi a échoué.");
        setStatus("error");
        return;
      }
      setStatus("success");
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        position: "Candidature spontanée",
        experience: "1 à 3 ans",
        education: "Licence / Bac+3",
        message: "",
        privacy: false,
        cv: undefined,
        identityDoc: undefined,
      });
    } catch (error) {
      setStatus("error");
      setServerError(
        error instanceof RequestTimeoutError
          ? "L’envoi prend trop de temps. Vérifiez votre connexion puis réessayez."
          : "L’envoi a échoué. Vous pouvez aussi nous écrire à bec@gmail.com.",
      );
    }
  }

  function onInvalid() {
    setStatus("error");
    setServerError("Vérifiez les champs signalés dans le formulaire, puis réessayez.");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-[#00af84]/25 bg-[#00af84]/5 p-8 text-center"
      >
        <CheckCircle className="mx-auto h-14 w-14 text-[#00af84]" aria-hidden />
        <h3 className="mt-4 text-xl font-bold text-[#065b48]">Candidature envoyée</h3>
        <p className="mt-2 text-muted-foreground">
          Merci. Votre dossier a bien été transmis à BEC. Nous l’examinons et
          vous recontactons si votre profil correspond à un besoin du cabinet.
        </p>
        <Button type="button" className="mt-6" onClick={() => setStatus("idle")}>
          Déposer une autre candidature
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8" noValidate>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#00af84]">Identité</p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="firstName" className="pl-10" placeholder="Prénom" autoComplete="given-name" {...register("firstName")} />
            </div>
            {errors.firstName ? <p className="text-sm text-destructive">{errors.firstName.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input id="lastName" placeholder="Nom de famille" autoComplete="family-name" {...register("lastName")} />
            {errors.lastName ? <p className="text-sm text-destructive">{errors.lastName.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="email" type="email" className="pl-10" placeholder="votre@email.com" autoComplete="email" {...register("email")} />
            </div>
            {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="phone" className="pl-10" placeholder="+243 ..." autoComplete="tel" {...register("phone")} />
            </div>
            {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="city">Ville *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="city" className="pl-10" placeholder="Lubumbashi, Kinshasa…" autoComplete="address-level2" {...register("city")} />
            </div>
            {errors.city ? <p className="text-sm text-destructive">{errors.city.message}</p> : null}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#00af84]">Profil</p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="position">Poste visé *</Label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <select
                id="position"
                className="flex h-12 w-full appearance-none rounded-md border border-input bg-card px-4 py-2 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("position")}
              >
                {careerPositions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.position ? <p className="text-sm text-destructive">{errors.position.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Expérience *</Label>
            <select
              id="experience"
              className="flex h-12 w-full appearance-none rounded-md border border-input bg-card px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("experience")}
            >
              {experienceLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.experience ? <p className="text-sm text-destructive">{errors.experience.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Formation *</Label>
            <div className="relative">
              <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <select
                id="education"
                className="flex h-12 w-full appearance-none rounded-md border border-input bg-card px-4 py-2 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("education")}
              >
                {educationLevels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {errors.education ? <p className="text-sm text-destructive">{errors.education.message}</p> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FileDrop
          id="cv"
          label="Curriculum vitae"
          hint={`PDF, Word, ODT ou RTF · ${acceptAttribute(cvExtensions)} · 8 Mo max.`}
          accept={acceptAttribute(cvExtensions)}
          file={cv}
          required
          error={errors.cv?.message}
          onFile={(file) => setValue("cv", file as File, { shouldValidate: true })}
          onClear={() => setValue("cv", undefined as unknown as File, { shouldValidate: true })}
        />
        <FileDrop
          id="identityDoc"
          label="Pièce d’identité"
          hint={`PDF, JPG ou PNG · ${acceptAttribute(identityExtensions)} · 8 Mo max.`}
          accept={acceptAttribute(identityExtensions)}
          file={identityDoc}
          error={errors.identityDoc?.message}
          onFile={(file) => setValue("identityDoc", file, { shouldValidate: true })}
          onClear={() => setValue("identityDoc", undefined, { shouldValidate: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Lettre de motivation *</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden />
          <Textarea
            id="message"
            className="pl-10"
            placeholder="Présentez votre parcours, vos compétences et ce que vous souhaitez apporter à BEC…"
            {...register("message")}
          />
        </div>
        {errors.message ? <p className="text-sm text-destructive">{errors.message.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1" {...register("privacy")} />
          <span>
            J’accepte que BEC traite mon identité, mon CV et les pièces jointes pour
            l’étude de cette candidature, conformément à la{" "}
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
            Envoyer ma candidature
          </>
        )}
      </Button>
      {status === "error" ? (
        <p role="alert" aria-live="assertive" className="text-sm text-destructive">
          {serverError || "L’envoi a échoué. Vous pouvez aussi nous écrire à bec@gmail.com."}
        </p>
      ) : null}
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <IdCard className="h-3.5 w-3.5" aria-hidden />
        Vos documents restent confidentiels et ne sont accessibles qu’à l’administration BEC.
      </p>
    </form>
  );
}
