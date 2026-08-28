import { z } from "zod";
import { educationLevels, experienceLevels } from "@/lib/recruitment";

function foldLabel(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u2018\u2019\u201A\u201B`]/g, "'")
    .trim();
}

function enumFrom<T extends readonly [string, ...string[]]>(options: T, message: string) {
  const aliases = new Map(options.map((item) => [foldLabel(item), item]));
  return z
    .string()
    .trim()
    .transform((value) => aliases.get(foldLabel(value)) ?? value)
    .pipe(z.enum(options, { errorMap: () => ({ message }) }));
}

export const applicationFieldsSchema = z.object({
  firstName: z.string().trim().min(2, "Veuillez indiquer votre prénom."),
  lastName: z.string().trim().min(2, "Veuillez indiquer votre nom."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: z.string().trim().min(8, "Veuillez indiquer un numéro de téléphone."),
  city: z.string().trim().min(2, "Veuillez indiquer votre ville."),
  position: z.string().trim().min(2, "Choisissez un profil.").max(80, "Le poste visé est trop long."),
  experience: enumFrom(experienceLevels, "Indiquez votre expérience."),
  education: enumFrom(educationLevels, "Indiquez votre formation."),
  message: z
    .string()
    .trim()
    .min(20, "Votre lettre de motivation est trop courte (20 caractères minimum).")
    .max(4000, "Votre lettre de motivation est trop longue."),
  privacy: z.boolean().refine((value) => value === true, {
    message: "Veuillez accepter le traitement de vos données.",
  }),
});

export type ApplicationFields = z.infer<typeof applicationFieldsSchema>;
