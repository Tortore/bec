import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/cms/password";
import { adminCookieName, adminSessionMaxAge, signSession, verifySessionToken } from "@/lib/cms/session";

function envCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "BecAdmin2022!",
  };
}

export async function ensureAdminUser() {
  const count = await prisma.adminUser.count();
  if (count > 0) return;
  const env = envCredentials();
  await prisma.adminUser.create({
    data: {
      username: env.username,
      name: "Administrateur",
      email: "bec@gmail.com",
      passwordHash: hashPassword(env.password),
      role: "admin",
      active: true,
    },
  });
}

export async function verifyLogin(username: string, password: string) {
  await ensureAdminUser();
  const user = await prisma.adminUser.findFirst({
    where: { username: { equals: username.trim(), mode: "insensitive" } },
  });
  if (user) {
    if (!user.active) return null;
    return verifyPassword(password, user.passwordHash) ? user : null;
  }

  const env = envCredentials();
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
