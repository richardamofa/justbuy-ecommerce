import { isLowStock, isOutOfStock } from "@ecommerce/contracts";
import { Badge, Card, CardContent, formatMoney, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@ecommerce/ui";
import { AlertTriangle, Package, ShoppingCart, Users } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { AdminLoadError } from "../components/AdminLoadError";
import { PageHeader } from "../components/PageHeader";
import { useAdminCustomers, useAdminOrders, useAdminProducts } from "../hooks/queries";

const statusTone = {
  pending: "neutral",
  paid: "moss",
  processing: "moss",
  shipped: "moss",
  delivered: "moss",
  cancelled: "signal",
  refunded: "signal",
} as const;

function StatCard({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-700">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-xs text-ink-400">{label}</p>
          <p className="text-lg font-medium text-ink-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: orders = [], isLoading: loadingOrders, isError: ordersError, refetch: refetchOrders } = useAdminOrders();
  const { data: products = [], isLoading: loadingProducts, isError: productsError, refetch: refetchProducts } = useAdminProducts();
  const { data: customers = [], isLoading: loadingCustomers, isError: customersError, refetch: refetchCustomers } = useAdminCustomers();

  const revenue = orders
    .filter((order) => ["paid", "processing", "shipped", "delivered"].includes(order.status))
    .reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter((p) => isLowStock(p) || isOutOfStock(p));
  const recentOrders = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  if (ordersError || productsError || customersError) {
    return <div><PageHeader title="Dashboard" description="An overview of the store." /><AdminLoadError onRetry={() => { void refetchOrders(); void refetchProducts(); void refetchCustomers(); }} /></div>;
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of the store." />

      {loadingOrders || loadingProducts || loadingCustomers ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={ShoppingCart} label="Orders" value={orders.length} />
          <StatCard icon={Package} label="Revenue" value={formatMoney(revenue)} />
          <StatCard icon={Users} label="Customers" value={customers.length} />
          <StatCard icon={AlertTriangle} label="Needs attention" value={lowStockProducts.length} />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">Recent orders</h2>
              <Link to="/orders" className="text-sm text-ink-500 hover:text-ink-900">
                View all
              </Link>
            </div>
            <Table>
              <Thead>
                <Tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentOrders.length === 0 && <Tr><Td colSpan={4} className="py-8 text-center text-ink-400">No orders yet.</Td></Tr>}
                {recentOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td className="font-medium text-ink-900">{order.orderNumber}</Td>
                    <Td>{order.customerEmail}</Td>
                    <Td>
                      <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                    </Td>
                    <Td>{formatMoney(order.total, order.currency)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">Low / out of stock</h2>
              <Link to="/inventory" className="text-sm text-ink-500 hover:text-ink-900">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-ink-100 px-5">
              {lowStockProducts.length === 0 && <li className="py-4 text-sm text-ink-400">Everything's in stock.</li>}
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-ink-700">{product.name}</span>
                  <Badge tone={product.stock <= 0 ? "signal" : "neutral"}>{product.stock} left</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
