import type {
    Category,
    Collection,
    Customer,
    HomepageSection,
    Order,
    Product,
    StoreSettings,
} from "@ecommerce/contracts";
import { mockCategories } from "../mocks/categories";
import { mockCollections } from "../mocks/collections";
import { mockCustomers } from "../mocks/customers";
import { mockHomepageSections } from "../mocks/homepage";
import { mockOrders } from "../mocks/orders";
import { mockProducts } from "../mocks/products";
import { mockStoreSettings } from "../mocks/store";
import { delay } from "./delay";

/**
 * In-memory mock "database" for the admin panel. No real persistence —
 * mutations only last for the current session/tab. Every function here
 * mirrors the shape of the eventual Fastify admin API
 * (e.g. PATCH /admin/products/:id), so the UI won't need to change when
 * it's wired to the real backend.
 */
let products = [...mockProducts];
let categories = [...mockCategories];
let collections = [...mockCollections];
let orders = [...mockOrders];
let customers = [...mockCustomers];
let sections = [...mockHomepageSections];
let settings = { ...mockStoreSettings };

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/* ------------------------------ Products --------------------------------- */
export async function listProducts(): Promise<Product[]> {
  return delay(products);
}
export async function saveProduct(input: Product): Promise<Product> {
  const exists = products.some((p) => p.id === input.id);
  products = exists ? products.map((p) => (p.id === input.id ? input : p)) : [{ ...input, id: uid("prod") }, ...products];
  return delay(input);
}
export async function deleteProduct(id: string): Promise<void> {
  products = products.filter((p) => p.id !== id);
  return delay(undefined);
}

/* ----------------------------- Categories --------------------------------- */
export async function listCategories(): Promise<Category[]> {
  return delay(categories);
}
export async function saveCategory(input: Category): Promise<Category> {
  const exists = categories.some((c) => c.id === input.id);
  categories = exists ? categories.map((c) => (c.id === input.id ? input : c)) : [...categories, { ...input, id: uid("cat") }];
  return delay(input);
}
export async function deleteCategory(id: string): Promise<void> {
  categories = categories.filter((c) => c.id !== id);
  return delay(undefined);
}

/* ---------------------------- Collections --------------------------------- */
export async function listCollections(): Promise<Collection[]> {
  return delay(collections);
}
export async function saveCollection(input: Collection): Promise<Collection> {
  const exists = collections.some((c) => c.id === input.id);
  collections = exists ? collections.map((c) => (c.id === input.id ? input : c)) : [...collections, { ...input, id: uid("col") }];
  return delay(input);
}
export async function deleteCollection(id: string): Promise<void> {
  collections = collections.filter((c) => c.id !== id);
  return delay(undefined);
}

/* -------------------------------- Orders ----------------------------------- */
export async function listOrders(): Promise<Order[]> {
  return delay(orders);
}
export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
  return delay(orders.find((o) => o.id === id)!);
}

/* ------------------------------- Customers ---------------------------------- */
export async function listCustomers(): Promise<Customer[]> {
  return delay(customers);
}

/* --------------------------- Homepage sections ------------------------------ */
export async function listSections(): Promise<HomepageSection[]> {
  return delay([...sections].sort((a, b) => a.position - b.position));
}
export async function saveSections(input: HomepageSection[]): Promise<HomepageSection[]> {
  sections = input;
  return delay(sections);
}

/* ------------------------------- Settings ------------------------------------ */
export async function getSettings(): Promise<StoreSettings> {
  return delay(settings);
}
export async function saveSettings(input: StoreSettings): Promise<StoreSettings> {
  settings = input;
  return delay(settings);
}
