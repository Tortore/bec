import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Veuillez indiquer votre nom."),
  email: z.string().email("Adresse e-mail invalide."),
  phone: z.string().optional(),
  subject: z.string().min(3, "Veuillez indiquer le sujet."),
  message: z.string().min(12, "Votre message est trop court."),
  privacy: z.boolean().refine((value) => value === true, {
    message: "Veuillez accepter le traitement de vos données.",
  }),
});

export type ContactValues = z.infer<typeof contactSchema>;
