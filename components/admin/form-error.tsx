const messages: Record<string, string> = {
  INVALID_ARTICLE: "Renseignez un titre, un texte de présentation, une image et une date valides.",
  INVALID_SERVICE: "Renseignez le titre, les descriptions et l’image du service.",
  INVALID_TEAM: "Renseignez le nom, le rôle, la spécialité et la photo du collaborateur.",
  INVALID_USER: "L’identifiant doit contenir au moins 3 caractères et le nom au moins 2.",
  USERNAME_TAKEN: "Cet identifiant est déjà utilisé par un autre compte.",
  WEAK_PASSWORD: "Le mot de passe doit contenir au moins 8 caractères.",
  INVALID_SETTINGS: "Vérifiez l’adresse e-mail et les coordonnées renseignées.",
};

export function AdminFormError({ code }: { code?: string }) {
  if (!code) return null;
  return (
    <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {messages[code] ?? "L’enregistrement a échoué. Vérifiez le formulaire puis réessayez."}
    </p>
  );
}
