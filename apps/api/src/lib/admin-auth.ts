import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const SESSION_COOKIE = "justbuy_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");

  const derivedKey = (await scryptAsync(
    password,
    salt,
    64,
  )) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derivedKey = (await scryptAsync(
    password,
    salt,
    64,
  )) as Buffer;

  const storedKey = Buffer.from(key, "hex");

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKey);
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

export function getSessionCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === "production";

  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${isProduction ? "None" : "Lax"}`,
    `Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}`,
    ...(isProduction ? ["Secure"] : []),
  ].join("; ");
}

export function getClearSessionCookie(): string {
  const isProduction = process.env.NODE_ENV === "production";

  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    `SameSite=${isProduction ? "None" : "Lax"}`,
    "Max-Age=0",
    ...(isProduction ? ["Secure"] : []),
  ].join("; ");
}

export function getSessionToken(request: {
  headers: Record<string, string | string[] | undefined>;
}): string | null {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader || Array.isArray(cookieHeader)) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (name === SESSION_COOKIE) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}
