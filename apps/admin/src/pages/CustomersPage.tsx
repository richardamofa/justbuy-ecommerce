import { EmptyState, formatDate, formatMoney, Modal, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@ecommerce/ui";
import * as React from "react";
import { AdminLoadError } from "../components/AdminLoadError";
import { PageHeader } from "../components/PageHeader";
import { useAdminCustomer, useAdminCustomers } from "../hooks/queries";

export function CustomersPage() {
  const { data: customers = [], isLoading, isError, refetch } = useAdminCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
  const { data: selectedCustomer, isLoading: loadingCustomer, isError: customerError, refetch: refetchCustomer } = useAdminCustomer(selectedCustomerId);

  if (isError) {
    return <div><PageHeader title="Customers" description="Everyone who has shopped with you." /><AdminLoadError onRetry={() => { void refetch(); }} /></div>;
  }

  return (
    <div>
      <PageHeader title="Customers" description="Everyone who has shopped with you." />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <EmptyState title="No customers yet" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Orders</Th>
              <Th>Total spent</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.map((customer) => (
              <Tr key={customer.id}>
                <Td className="font-medium text-ink-900">
                  <button type="button" onClick={() => setSelectedCustomerId(customer.id)} className="text-left underline decoration-ink-300 underline-offset-4 hover:text-moss-700">
                    {customer.firstName} {customer.lastName}
                  </button>
                </Td>
                <Td>{customer.email}</Td>
                <Td>{customer.ordersCount}</Td>
                <Td>{formatMoney(customer.totalSpent)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={selectedCustomerId !== null} onClose={() => setSelectedCustomerId(null)} title={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : "Customer details"}>
        {loadingCustomer ? (
          <div className="space-y-3"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-20 w-full" /></div>
        ) : customerError ? (
          <AdminLoadError onRetry={() => { void refetchCustomer(); }} />
        ) : selectedCustomer ? (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-ink-400">Email</p><p className="break-all text-ink-900">{selectedCustomer.email}</p></div>
              <div><p className="text-ink-400">Phone</p><p className="text-ink-900">{selectedCustomer.phone ?? "Not provided"}</p></div>
              <div><p className="text-ink-400">Customer since</p><p className="text-ink-900">{selectedCustomer.createdAt ? formatDate(selectedCustomer.createdAt) : "—"}</p></div>
              <div><p className="text-ink-400">Lifetime spend</p><p className="text-ink-900">{formatMoney(selectedCustomer.totalSpent)}</p></div>
            </div>
            <section>
              <h3 className="mb-2 font-medium text-ink-900">Addresses</h3>
              {selectedCustomer.addresses.length ? <ul className="space-y-2">{selectedCustomer.addresses.map((address) => <li key={address.id} className="border-l-2 border-moss-300 pl-3 text-ink-600">{address.fullName}{address.isDefault ? " · Default" : ""}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />{address.city}, {address.country}</li>)}</ul> : <p className="text-ink-400">No saved addresses.</p>}
            </section>
            <section>
              <h3 className="mb-2 font-medium text-ink-900">Orders ({selectedCustomer.orders.length})</h3>
              {selectedCustomer.orders.length ? <ul className="divide-y divide-ink-100 border-y border-ink-100">{selectedCustomer.orders.map((order) => <li key={order.id} className="flex justify-between gap-3 py-3"><span><strong className="font-medium text-ink-900">{order.orderNumber}</strong><br /><span className="text-ink-500">{formatDate(order.createdAt)} · {order.status} · {order.paymentStatus} · {order.fulfillmentMethod}</span><br /><span className="text-ink-500">{order.fulfillmentLocation}</span><br /><span className="text-ink-500">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</span></span><span className="shrink-0">{formatMoney(order.total, order.currency)}</span></li>)}</ul> : <p className="text-ink-400">No orders yet.</p>}
            </section>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
