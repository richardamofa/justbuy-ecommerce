import type { AdminLoginInput } from "@ecommerce/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@ecommerce/ui";
import {
    getCurrentAdmin,
    loginAdmin,
    logoutAdmin,
} from "../services/auth.js";

const ADMIN_AUTH_KEY = ["admin-auth"];

export function useCurrentAdmin() {
  return useQuery({
    queryKey: ADMIN_AUTH_KEY,
    queryFn: getCurrentAdmin,
    retry: false,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: AdminLoginInput) => loginAdmin(input),
    onSuccess: ({ admin }) => {
      queryClient.setQueryData(ADMIN_AUTH_KEY, admin);
      success("Signed in", "Welcome back to your JustBuy admin.");
    },
    onError: (err) => {
      error("Unable to sign in", err instanceof Error ? err.message : "Please check your credentials and try again.");
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.setQueryData(ADMIN_AUTH_KEY, null);
      queryClient.clear();
      success("Signed out", "Your admin session has ended.");
    },
    onError: (err) => {
      error("Unable to sign out", err instanceof Error ? err.message : "Please try again.");
    },
  });
}