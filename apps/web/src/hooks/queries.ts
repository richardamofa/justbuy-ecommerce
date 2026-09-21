import { useQuery } from "@tanstack/react-query";
import type { ProductListQuery } from "@ecommerce/contracts";
import * as productsApi from "../services/products";
import * as storeApi from "../services/store";

export function useProducts(query: Partial<ProductListQuery>) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => productsApi.listProducts(query),
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.getProductBySlug(slug!),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: storeApi.listCategories });
}

export function useCategory(slug: string | undefined) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => storeApi.getCategoryBySlug(slug!),
    enabled: !!slug,
  });
}

export function useCollections() {
  return useQuery({ queryKey: ["collections"], queryFn: storeApi.listCollections });
}

export function useCollection(slug: string | undefined) {
  return useQuery({
    queryKey: ["collection", slug],
    queryFn: () => storeApi.getCollectionBySlug(slug!),
    enabled: !!slug,
  });
}

export function useHomepageConfig() {
  return useQuery({ queryKey: ["homepage"], queryFn: storeApi.getHomepageConfig });
}

export function useStoreSettings() {
  return useQuery({ queryKey: ["store-settings"], queryFn: storeApi.getStoreSettings });
}
