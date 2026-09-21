import { useAdminCustomers } from "../hooks/queries";
import { PageHeader } from "../components/PageHeader";
import { Table, Thead, Tbody, Tr, Th, Td, formatMoney, Skeleton, EmptyState } from "@ecommerce/ui";

export function CustomersPage() {
  const { data: customers = [], isLoading } = useAdminCustomers();

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
                  {customer.firstName} {customer.lastName}
                </Td>
                <Td>{customer.email}</Td>
                <Td>{customer.ordersCount}</Td>
                <Td>{formatMoney(customer.totalSpent)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
