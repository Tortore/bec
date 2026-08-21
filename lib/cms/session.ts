const COOKIE = "bec_admin";
const MAX_AGE = 60 * 60 * 12;

type SessionPayload = {
  user: string;
  exp: number;
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && (!value || value.length < 32)) {
    throw new Error("SESSION_SECRET doit contenir au moins 32 caractères en production.");
  }
  return value || "bec-development-session-secret";
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const buffer = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  buffer.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(signature);
}

export async function signSession(user: string) {
  const payload: SessionPayload = { user, exp: Date.now() + MAX_AGE * 1000 };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmac(body);
  return `${body}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = await hmac(body);
  const a = fromBase64Url(expected);
  const b = fromBase64Url(signature);
  if (a.length !== b.length) return null;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  if (diff !== 0) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const adminCookieName = COOKIE;
export const adminSessionMaxAge = MAX_AGE;
