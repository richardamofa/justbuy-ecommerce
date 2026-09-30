import type { Order } from "@ecommerce/contracts";
import { EmptyState, formatDate, formatMoney, Select, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@ecommerce/ui";
import { PageHeader } from "../components/PageHeader";
import { useAdminOrders, useUpdateOrderStatus } from "../hooks/queries";

const statuses: Order["status"][] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function OrdersPage() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <div>
      <PageHeader title="Orders" description="Track and update order fulfilment." />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td className="font-medium text-ink-900">{order.orderNumber}</Td>
                <Td>{order.customerEmail}</Td>
                <Td className="text-ink-500">{formatDate(order.createdAt)}</Td>
                <Td>{formatMoney(order.total, order.currency)}</Td>
                <Td>
                  <Select
                    value={order.status}
                    className="w-auto"
                    onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as Order["status"] })}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
