import type { Order } from "@ecommerce/contracts";
import { mockProducts } from "./products";

const p = (id: string) => mockProducts.find((x) => x.id === id)!;

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const mockOrders: Order[] = [
  {
    id: "order_1001",
    orderNumber: "JUSTBUY-1001",
    customerEmail: "ama.owusu@example.com",
    status: "delivered",
    items: [{ id: "i1", productId: p("prod_merino_sweater").id, name: p("prod_merino_sweater").name, unitPrice: 320, quantity: 1, total: 320, options: {} }],
    subtotal: 320,
    shipping: 35,
    tax: 0,
    discount: 0,
    total: 355,
    currency: "GHS",
    createdAt: daysAgo(18),
  },
  {
    id: "order_1002",
    orderNumber: "JUSTBUY-1002",
    customerEmail: "kojo.mensah@example.com",
    status: "processing",
    items: [
      { id: "i2", productId: p("prod_leather_derby").id, name: p("prod_leather_derby").name, unitPrice: 980, quantity: 1, total: 980, options: {} },
    ],
    subtotal: 980,
    shipping: 35,
    tax: 0,
    discount: 0,
    total: 1015,
    currency: "GHS",
    createdAt: daysAgo(2),
  },
  {
    id: "order_1003",
    orderNumber: "JUSTBUY-1003",
    customerEmail: "efua.asante@example.com",
    status: "pending",
    items: [
      { id: "i3", productId: p("prod_wool_coat").id, name: p("prod_wool_coat").name, unitPrice: 1450, quantity: 1, total: 1450, options: {} },
      { id: "i4", productId: p("prod_ceramic_vase").id, name: p("prod_ceramic_vase").name, unitPrice: 260, quantity: 2, total: 520, options: {} },
    ],
    subtotal: 1970,
    shipping: 35,
    tax: 0,
    discount: 0,
    total: 2005,
    currency: "GHS",
    createdAt: daysAgo(0),
  },
  {
    id: "order_1004",
    orderNumber: "JUSTBUY-1004",
    customerEmail: "yaw.boateng@example.com",
    status: "cancelled",
    items: [{ id: "i5", productId: p("prod_cotton_shirt").id, name: p("prod_cotton_shirt").name, unitPrice: 280, quantity: 1, total: 280, options: {} }],
    subtotal: 280,
    shipping: 35,
    tax: 0,
    discount: 0,
    total: 315,
    currency: "GHS",
    createdAt: daysAgo(6),
  },
];
