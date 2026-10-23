import type { Order } from "@ecommerce/contracts";
import { mockProducts } from "./products";

const p = (id: string) => mockProducts.find((x) => x.id === id)!;

export const mockOrders: Order[] = [
  {
    id: "order_1001",
    orderNumber: "FORM-1001",
    customerEmail: "demo@form-store.example",
    status: "delivered",
    paymentStatus: "paid",
    inventoryIssue: false,
    items: [
      {
        id: "item_1",
        productId: p("prod_merino_sweater").id,
        name: p("prod_merino_sweater").name,
        image: p("prod_merino_sweater").images[0],
        options: { Color: "Ink", Size: "M" },
        unitPrice: 320,
        quantity: 1,
        total: 320,
      },
    ],
    subtotal: 320,
    shipping: 35,
    tax: 0,
    discount: 0,
    total: 355,
    currency: "GHS",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
  {
    id: "order_1002",
    orderNumber: "FORM-1002",
    customerEmail: "demo@form-store.example",
    status: "processing",
    paymentStatus: "paid",
    inventoryIssue: false,
    items: [
      {
        id: "item_2",
        productId: p("prod_canvas_sneaker").id,
        name: p("prod_canvas_sneaker").name,
        image: p("prod_canvas_sneaker").images[0],
        options: { Color: "White", Size: "42" },
        unitPrice: 270,
        quantity: 1,
        total: 270,
      },
      {
        id: "item_3",
        productId: p("prod_wool_scarf").id,
        name: p("prod_wool_scarf").name,
        image: p("prod_wool_scarf").images[0],
        options: { Color: "Charcoal" },
        unitPrice: 180,
        quantity: 1,
        total: 180,
      },
    ],
    subtotal: 450,
    shipping: 35,
    tax: 0,
    discount: 0,
    total: 485,
    currency: "GHS",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];
