import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export function getAdminConfig() {
  return {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
    token: process.env.ADMIN_SESSION_TOKEN || "",
  };
}

export function isAdminConfigured() {
  const c = getAdminConfig();
  return Boolean(c.email && c.password && c.token);
}

export async function isAdminRequest() {
  const c = getAdminConfig();
  if (!isAdminConfigured()) return false;
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === c.token;
}

export async function setAdminSession() {
  const c = getAdminConfig();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, c.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}
