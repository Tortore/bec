import { z } from "zod";
import {
  careerPositions,
  educationLevels,
  experienceLevels,
} from "@/lib/recruitment";

export const applicationFieldsSchema = z.object({
  firstName: z.string().trim().min(2, "Veuillez indiquer votre prénom."),
  lastName: z.string().trim().min(2, "Veuillez indiquer votre nom."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: z.string().trim().min(8, "Veuillez indiquer un numéro de téléphone."),
  city: z.string().trim().min(2, "Veuillez indiquer votre ville."),
  position: z.enum(careerPositions, {
    errorMap: () => ({ message: "Choisissez un profil." }),
  }),
  experience: z.enum(experienceLevels, {
    errorMap: () => ({ message: "Indiquez votre expérience." }),
  }),
  education: z.enum(educationLevels, {
    errorMap: () => ({ message: "Indiquez votre formation." }),
  }),
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
