import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Collection, HomepageSection, Order, Product, StoreSettings } from "@ecommerce/contracts";
import * as api from "../services/admin";

export function useAdminProducts() {
  return useQuery({ queryKey: ["admin", "products"], queryFn: api.listProducts });
}
export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Product) => api.saveProduct(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useAdminCategories() {
  return useQuery({ queryKey: ["admin", "categories"], queryFn: api.listCategories });
}
export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Category) => api.saveCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useAdminCollections() {
  return useQuery({ queryKey: ["admin", "collections"], queryFn: api.listCollections });
}
export function useSaveCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Collection) => api.saveCollection(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "collections"] }),
  });
}
export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCollection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "collections"] }),
  });
}

export function useAdminOrders() {
  return useQuery({ queryKey: ["admin", "orders"], queryFn: api.listOrders });
}
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) => api.updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useAdminCustomers() {
  return useQuery({ queryKey: ["admin", "customers"], queryFn: api.listCustomers });
}

export function useAdminSections() {
  return useQuery({ queryKey: ["admin", "sections"], queryFn: api.listSections });
}
export function useSaveSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: HomepageSection[]) => api.saveSections(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sections"] }),
  });
}

export function useAdminSettings() {
  return useQuery({ queryKey: ["admin", "settings"], queryFn: api.getSettings });
}
export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreSettings) => api.saveSettings(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}
