import type { AdminLoginInput } from "@ecommerce/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  return useMutation({
    mutationFn: (input: AdminLoginInput) => loginAdmin(input),
    onSuccess: ({ admin }) => {
      queryClient.setQueryData(ADMIN_AUTH_KEY, admin);
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.setQueryData(ADMIN_AUTH_KEY, null);
      queryClient.clear();
    },
  });
}