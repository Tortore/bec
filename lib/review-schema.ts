import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom.").max(80),
  email: z.string().trim().email("Adresse e-mail invalide.").max(160),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(10, "Votre avis est trop court.").max(1000),
  privacy: z.boolean().refine((value) => value, {
    message: "Veuillez accepter le traitement de vos données.",
  }),
  website: z.string().max(0).optional(),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
