import type { AdminLoginInput } from "@ecommerce/contracts";
import {
    generateSessionToken,
    getSessionExpiresAt,
    hashPassword,
    hashSessionToken,
    verifyPassword,
} from "../lib/admin-auth.js";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

export async function login(input: AdminLoginInput) {
  const email = input.email.trim().toLowerCase();

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin || !admin.isActive) {
    throw HttpError.unauthorized("Invalid email or password.");
  }

  const passwordValid = await verifyPassword(
    input.password,
    admin.passwordHash,
  );

  if (!passwordValid) {
    throw HttpError.unauthorized("Invalid email or password.");
  }

  const sessionToken = generateSessionToken();
  const tokenHash = hashSessionToken(sessionToken);
  const expiresAt = getSessionExpiresAt();

  await prisma.adminSession.create({
    data: {
      tokenHash,
      adminId: admin.id,
      expiresAt,
    },
  });

  return {
    sessionToken,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

export async function getAdminBySessionToken(token: string) {
  const tokenHash = hashSessionToken(token);

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: {
      admin: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.adminSession.delete({
      where: { id: session.id },
    });

    return null;
  }

  if (!session.admin.isActive) {
    return null;
  }

  return {
    sessionId: session.id,
    admin: {
      id: session.admin.id,
      email: session.admin.email,
      name: session.admin.name,
      role: session.admin.role,
    },
  };
}

export async function logout(token: string) {
  const tokenHash = hashSessionToken(token);

  await prisma.adminSession.deleteMany({
    where: { tokenHash },
  });
}

export async function createAdmin(input: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existing) {
    throw HttpError.conflict("An admin with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name: input.name,
      role: input.role ?? "admin",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });
}