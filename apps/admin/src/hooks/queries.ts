import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
    Category,
    Collection,
    HomepageSection,
    Order,
    Product,
    StoreSettings
} from "@ecommerce/contracts";

import { useToast } from "@ecommerce/ui";
import * as api from "../services/admin";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: api.listProducts,
  });
}

export function useSaveProduct() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: Product) => api.saveProduct(input),

    onSuccess: (_, input) => {
      qc.invalidateQueries({
        queryKey: ["admin", "products"],
      });

      success(
        input.id ? "Product updated" : "Product created",
        input.id
          ? "The product was successfully updated."
          : "The product was successfully added to your catalog.",
      );
    },

    onError: (err) => {
      error(
        "Unable to save product",
        getErrorMessage(
          err,
          "Something went wrong while saving the product.",
        ),
      );
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "products"],
      });

      success(
        "Product deleted",
        "The product was successfully removed.",
      );
    },

    onError: (err) => {
      error(
        "Unable to delete product",
        getErrorMessage(
          err,
          "Something went wrong while deleting the product.",
        ),
      );
    },
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: api.listCategories,
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: Category) => api.saveCategory(input),

    onSuccess: (_, input) => {
      qc.invalidateQueries({
        queryKey: ["admin", "categories"],
      });

      success(
        input.id ? "Category updated" : "Category created",
        input.id
          ? "The category was successfully updated."
          : "The category was successfully created.",
      );
    },

    onError: (err) => {
      error(
        "Unable to save category",
        getErrorMessage(
          err,
          "Something went wrong while saving the category.",
        ),
      );
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "categories"],
      });

      success(
        "Category deleted",
        "The category was successfully removed.",
      );
    },

    onError: (err) => {
      error(
        "Unable to delete category",
        getErrorMessage(
          err,
          "Something went wrong while deleting the category.",
        ),
      );
    },
  });
}

export function useAdminCollections() {
  return useQuery({
    queryKey: ["admin", "collections"],
    queryFn: api.listCollections,
  });
}

export function useSaveCollection() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: Collection) => api.saveCollection(input),

    onSuccess: (_, input) => {
      qc.invalidateQueries({
        queryKey: ["admin", "collections"],
      });

      success(
        input.id ? "Collection updated" : "Collection created",
        input.id
          ? "The collection was successfully updated."
          : "The collection was successfully created.",
      );
    },

    onError: (err) => {
      error(
        "Unable to save collection",
        getErrorMessage(
          err,
          "Something went wrong while saving the collection.",
        ),
      );
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.deleteCollection(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "collections"],
      });

      success(
        "Collection deleted",
        "The collection was successfully removed.",
      );
    },

    onError: (err) => {
      error(
        "Unable to delete collection",
        getErrorMessage(
          err,
          "Something went wrong while deleting the collection.",
        ),
      );
    },
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: api.listOrders,
  });
}

export function useAdminOrder(id: string | null) {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: () => api.getOrder(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Order["status"];
    }) => api.updateOrderStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      success(
        "Order updated",
        "The order status was successfully updated.",
      );
    },

    onError: (err) => {
      error(
        "Unable to update order",
        getErrorMessage(
          err,
          "Something went wrong while updating the order.",
        ),
      );
    },
  });
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: ["admin", "customers"],
    queryFn: api.listCustomers,
  });
}

export function useAdminCustomer(id: string | null) {
  return useQuery({
    queryKey: ["admin", "customers", id],
    queryFn: () => api.getCustomer(id!),
    enabled: Boolean(id),
  });
}

export function useAdminEvents(isResolved: boolean) {
  return useQuery({
    queryKey: ["admin", "events", isResolved],
    queryFn: () => api.listAdminEvents({ isResolved }),
  });
}

export function useSetAdminEventResolved() {
  const qc = useQueryClient();
  const { success, error } = useToast();
  return useMutation({
    mutationFn: ({ id, isResolved }: { id: string; isResolved: boolean }) => api.setAdminEventResolved(id, isResolved),
    onSuccess: (_, input) => {
      void qc.invalidateQueries({ queryKey: ["admin", "events"] });
      success(input.isResolved ? "Event resolved" : "Event reopened", "The activity log has been updated.");
    },
    onError: (err) => error("Unable to update event", getErrorMessage(err, "Please try again.")),
  });
}

export function useAdminSections() {
  return useQuery({
    queryKey: ["admin", "sections"],
    queryFn: api.listSections,
  });
}

export function useSaveSections() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: HomepageSection[]) => api.saveSections(input),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "sections"],
      });

      success(
        "Homepage updated",
        "Your homepage sections were successfully saved.",
      );
    },

    onError: (err) => {
      error(
        "Unable to save homepage",
        getErrorMessage(
          err,
          "Something went wrong while saving the homepage.",
        ),
      );
    },
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: api.getSettings,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (input: StoreSettings) => api.saveSettings(input),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "settings"],
      });

      success(
        "Settings saved",
        "Your store settings were successfully updated.",
      );
    },

    onError: (err) => {
      error(
        "Unable to save settings",
        getErrorMessage(
          err,
          "Something went wrong while saving your settings.",
        ),
      );
    },
  });
}