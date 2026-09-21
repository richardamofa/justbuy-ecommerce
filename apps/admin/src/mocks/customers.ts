import type { Customer } from "@ecommerce/contracts";

export const mockCustomers: Customer[] = [
  { id: "cust_1", firstName: "Ama", lastName: "Owusu", email: "ama.owusu@example.com", ordersCount: 4, totalSpent: 2140, addresses: [] },
  { id: "cust_2", firstName: "Kojo", lastName: "Mensah", email: "kojo.mensah@example.com", ordersCount: 1, totalSpent: 1015, addresses: [] },
  { id: "cust_3", firstName: "Efua", lastName: "Asante", email: "efua.asante@example.com", ordersCount: 2, totalSpent: 2005, addresses: [] },
  { id: "cust_4", firstName: "Yaw", lastName: "Boateng", email: "yaw.boateng@example.com", ordersCount: 1, totalSpent: 0, addresses: [] },
];
