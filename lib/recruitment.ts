export const MAX_APPLICATION_BYTES = 8 * 1024 * 1024;

export const careerPositions = [
  "Architecte",
  "Ingénieur civil",
  "Ingénieur BTP",
  "Designer d’intérieur",
  "Urbaniste",
  "Topographe",
  "Chargé de projets",
  "Administration",
  "Stage",
  "Candidature spontanée",
] as const;

export const experienceLevels = [
  "Stage / débutant",
  "Moins d’1 an",
  "1 à 3 ans",
  "3 à 5 ans",
  "5 à 10 ans",
  "Plus de 10 ans",
] as const;

export const educationLevels = [
  "Diplôme technique",
  "Licence / Bac+3",
  "Master / Bac+5",
  "Doctorat",
  "Autre",
] as const;

export const applicationStatuses = [
  "nouveau",
  "en_cours",
  "entretien",
  "retenu",
  "refuse",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type CareerPosition = (typeof careerPositions)[number];

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  entretien: "Entretien",
  retenu: "Retenu",
  refuse: "Refusé",
};

export const applicationStatusClasses: Record<ApplicationStatus, string> = {
  nouveau: "bg-emerald-50 text-emerald-800",
  en_cours: "bg-amber-50 text-amber-800",
  entretien: "bg-sky-50 text-sky-800",
  retenu: "bg-[#00af84]/15 text-[#065b48]",
  refuse: "bg-slate-100 text-slate-600",
};

export const cvExtensions = [".pdf", ".doc", ".docx", ".odt", ".rtf"] as const;
export const identityExtensions = [".pdf", ".jpg", ".jpeg", ".png"] as const;

const cvExtSet = new Set<string>(cvExtensions);
const identityExtSet = new Set<string>(identityExtensions);

export function fileExtension(name: string) {
  const match = /\.([a-z0-9]+)$/i.exec(name.trim());
  return match ? `.${match[1].toLowerCase()}` : "";
}

export function isAllowedCvName(name: string) {
  return cvExtSet.has(fileExtension(name));
}

export function isAllowedIdentityName(name: string) {
  return identityExtSet.has(fileExtension(name));
}

export function acceptAttribute(extensions: readonly string[]) {
  return extensions.join(",");
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return applicationStatuses.includes(value as ApplicationStatus);
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
