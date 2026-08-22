export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
// Les formulaires appartiennent à cette application. Une URL relative évite
// d’envoyer les données vers un autre port ou sous-domaine et les erreurs CORS.
export const apiUrl = "/api";

export function recruitmentEndpoint() {
  return "/api/recrutement";
}

export function contactEndpoint() {
  return "/api/contact";
}
