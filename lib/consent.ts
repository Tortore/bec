export const CONSENT_KEY = "bec-cookie-consent";

export type ConsentChoices = {
  analytics: boolean;
  maps: boolean;
};

export type StoredConsent = ConsentChoices & {
  decidedAt: string;
};

export const defaultChoices: ConsentChoices = {
  analytics: false,
  maps: false,
};

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (!parsed.decidedAt) return null;
    return {
      analytics: Boolean(parsed.analytics),
      maps: Boolean(parsed.maps),
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function writeConsent(choices: ConsentChoices): StoredConsent {
  const stored: StoredConsent = {
    ...choices,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
  return stored;
}
