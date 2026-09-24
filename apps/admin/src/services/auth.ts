import type {
    AdminAuthResponse,
    AdminLoginInput,
    AdminUser,
} from "@ecommerce/contracts";
import { apiRequest } from "../lib/api-client.js";

export async function loginAdmin(
  input: AdminLoginInput,
): Promise<AdminAuthResponse> {
  return apiRequest<AdminAuthResponse>("/api/v1/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const response = await apiRequest<{ admin: AdminUser | null }>(
    "/api/v1/admin/auth/me",
  );

  return response.admin;
}

export async function logoutAdmin(): Promise<void> {
  await apiRequest<{ success: boolean }>("/api/v1/admin/auth/logout", {
    method: "POST",
  });
}