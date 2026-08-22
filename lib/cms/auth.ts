import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/cms/password";
import { adminCookieName, adminSessionMaxAge, signSession, verifySessionToken } from "@/lib/cms/session";

function envCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production" && (!username || !password)) {
    throw new Error("ADMIN_USERNAME et ADMIN_PASSWORD sont requis en production.");
  }
  return {
    username: username || "admin",
    password: password || "bec-development-only",
  };
}

export async function ensureAdminUser() {
  const count = await prisma.adminUser.count();
  if (count > 0) return;
  const env = envCredentials();
  await prisma.adminUser.upsert({
    where: { username: env.username },
    create: {
      username: env.username,
      name: "Administrateur",
      email: "bec@gmail.com",
      passwordHash: hashPassword(env.password),
      role: "admin",
      active: true,
    },
    update: {},
  });
}

export async function verifyLogin(username: string, password: string) {
  await ensureAdminUser();
  const env = envCredentials();
  const user = await prisma.adminUser.findFirst({
    where: { username: { equals: username.trim(), mode: "insensitive" } },
  });
  if (user) {
    if (!user.active) return null;
    if (verifyPassword(password, user.passwordHash)) return user;
    // En local, le hash en base peut dater d’un ancien mot de passe :
    // si les identifiants .env.local sont corrects, on les resynchronise.
    if (
      process.env.NODE_ENV !== "production" &&
      username.trim().toLowerCase() === env.username.toLowerCase() &&
      password === env.password
    ) {
      return prisma.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: hashPassword(password), active: true },
      });
    }
    return null;
  }

  if (username.trim() === env.username && password === env.password) {
    return prisma.adminUser.create({
      data: {
        username: env.username,
        name: "Administrateur",
        passwordHash: hashPassword(env.password),
        role: "admin",
        active: true,
      },
    });
  }
  return null;
}

export async function getAdminSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(adminCookieName)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function setSessionCookie(user: string) {
  const jar = await cookies();
  jar.set(adminCookieName, await signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSessionMaxAge,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(adminCookieName);
}
