import type { CustomerListQuery } from "@ecommerce/contracts";
import type { Prisma } from "@prisma/client";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapOrder } from "../mappers/order.js";

type CustomerForAdmin = Prisma.CustomerGetPayload<{
  include: {
    addresses: true;
    orders: { select: { total: true; status: true } };
  };
}>;

function mapCustomer(customer: CustomerForAdmin) {
  const paidOrders = customer.orders.filter((order) => ["paid", "processing", "shipped", "delivered", "completed"].includes(order.status));
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    ...(customer.phone ? { phone: customer.phone } : {}),
    addresses: customer.addresses.map((address) => ({
      id: address.id,
      fullName: address.fullName,
      ...(address.phone ? { phone: address.phone } : {}),
      line1: address.line1,
      ...(address.line2 ? { line2: address.line2 } : {}),
      city: address.city,
      ...(address.region ? { region: address.region } : {}),
      country: address.country,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      isDefault: address.isDefault,
    })),
    ordersCount: customer.orders.length,
    totalSpent: paidOrders.reduce((total, order) => total + Number(order.total), 0),
    createdAt: customer.createdAt.toISOString(),
  };
}

const customerDetailsInclude = {
  addresses: true,
  orders: { include: { items: true }, orderBy: { createdAt: "desc" as const } },
};

export async function listCustomers(query: CustomerListQuery) {
  const skip = (query.page - 1) * query.pageSize;
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
    include: {
      addresses: true,
      orders: {
        select: { total: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: query.pageSize,
    }),
    prisma.customer.count(),
  ]);

  const items = customers.map(mapCustomer);

  return {
    items,
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.ceil(total / query.pageSize),
  };
}

export async function getCustomerDetails(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: customerDetailsInclude,
  });
  if (!customer) throw HttpError.notFound("Customer not found.");

  return {
    ...mapCustomer(customer),
    orders: customer.orders.map(mapOrder),
  };
}