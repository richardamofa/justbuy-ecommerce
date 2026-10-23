import type { Order } from "@ecommerce/contracts";
import { Button, EmptyState, formatDate, formatMoney, Modal, Select, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@ecommerce/ui";
import { AlertTriangle } from "lucide-react";
import * as React from "react";
import { AdminLoadError } from "../components/AdminLoadError";
import { PageHeader } from "../components/PageHeader";
import { useAdminOrder, useAdminOrders, useUpdateOrderStatus } from "../hooks/queries";

const statuses: Order["status"][] = ["pending", "paid", "processing", "shipped", "delivered", "completed", "cancelled", "refunded"];

export function OrdersPage() {
  const { data: orders = [], isLoading, isError, refetch } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const { data: selectedOrder, isLoading: loadingSelectedOrder, isError: selectedOrderError, refetch: refetchSelectedOrder } = useAdminOrder(selectedOrderId);

  if (isError) {
    return <div><PageHeader title="Orders" description="Track and update order fulfilment." /><AdminLoadError onRetry={() => { void refetch(); }} /></div>;
  }

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
                <Td className="font-medium text-ink-900">
                  <button type="button" onClick={() => setSelectedOrderId(order.id)} className="text-left underline decoration-ink-300 underline-offset-4 hover:text-moss-700">
                    {order.orderNumber}
                  </button>
                </Td>
                <Td>{order.customerEmail}</Td>
                <Td className="text-ink-500">{formatDate(order.createdAt)}</Td>
                <Td>{formatMoney(order.total, order.currency)}</Td>
                <Td>
                  <Select
                    value={order.status}
                    className="w-auto"
                    disabled={updateStatus.isPending}
                    onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as Order["status"] })}
                  >
                    {statuses.filter((status) => {
                      if (order.paymentStatus !== "paid") return ["pending", "cancelled"].includes(status);
                      if (status === "pending") return false;
                      if (order.fulfillmentMethod === "pickup" && ["shipped", "delivered"].includes(status)) return false;
                      if (status === "completed") return order.fulfillmentMethod === "pickup" ? order.status === "processing" : order.status === "delivered";
                      return true;
                    }).map((s) => (
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

      <Modal isOpen={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)} title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : "Order details"}>
        {loadingSelectedOrder ? (
          <div className="space-y-3"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-20 w-full" /></div>
        ) : selectedOrderError ? (
          <AdminLoadError onRetry={() => { void refetchSelectedOrder(); }} />
        ) : selectedOrder ? (
          <div className="space-y-5 text-sm">
            <dl className="grid grid-cols-2 gap-3">
              <div><dt className="text-ink-400">Customer</dt><dd className="break-all text-ink-900">{selectedOrder.customerEmail}</dd></div>
              <div><dt className="text-ink-400">Placed</dt><dd className="text-ink-900">{formatDate(selectedOrder.createdAt)}</dd></div>
              <div><dt className="text-ink-400">Fulfilment status</dt><dd className="capitalize text-ink-900">{selectedOrder.status}</dd></div>
              <div><dt className="text-ink-400">Method</dt><dd className="capitalize text-ink-900">{selectedOrder.fulfillmentMethod}</dd></div>
              <div><dt className="text-ink-400">Payment</dt><dd className="capitalize text-ink-900">{selectedOrder.paymentStatus}{selectedOrder.paymentReference ? ` · ${selectedOrder.paymentReference}` : ""}</dd></div>
            </dl>
            {selectedOrder.inventoryIssue && <p className="flex items-center gap-2 rounded bg-amber-50 p-3 text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />Paid order needs inventory review.</p>}
            <div>
              <h3 className="mb-2 font-medium text-ink-900">Items</h3>
              <ul className="divide-y divide-ink-100 border-y border-ink-100">
                {selectedOrder.items.map((item) => <li key={item.id} className="flex justify-between gap-3 py-3"><span>{item.name} × {item.quantity}{Object.keys(item.options).length ? ` · ${Object.values(item.options).join(" / ")}` : ""}</span><span className="shrink-0">{formatMoney(item.total, selectedOrder.currency)}</span></li>)}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 text-ink-600">
              <p>Subtotal <span className="float-right">{formatMoney(selectedOrder.subtotal, selectedOrder.currency)}</span></p>
              <p>Delivery fee <span className="float-right">{formatMoney(selectedOrder.deliveryFee, selectedOrder.currency)}</span></p>
              <p>Tax <span className="float-right">{formatMoney(selectedOrder.tax, selectedOrder.currency)}</span></p>
              <p className="font-semibold text-ink-900">Total <span className="float-right">{formatMoney(selectedOrder.total, selectedOrder.currency)}</span></p>
            </div>
            <div><h3 className="mb-1 font-medium text-ink-900">{selectedOrder.fulfillmentMethod === "pickup" ? "Pickup location" : "Delivery destination"}</h3><p className="text-ink-600">{selectedOrder.fulfillmentLocation}{selectedOrder.shippingAddress && <><br />{selectedOrder.shippingAddress.fullName}<br />{selectedOrder.shippingAddress.phone}</>}</p></div>
            <div className="flex justify-end border-t border-ink-100 pt-4"><Button variant="outline" onClick={() => setSelectedOrderId(null)}>Close</Button></div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
