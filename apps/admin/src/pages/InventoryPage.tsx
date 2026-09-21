import * as React from "react";
import { isLowStock, isOutOfStock } from "@ecommerce/contracts";
import { useAdminProducts } from "../hooks/queries";
import { PageHeader } from "../components/PageHeader";
import { Table, Thead, Tbody, Tr, Th, Td, Badge, Tabs, Skeleton, EmptyState } from "@ecommerce/ui";

type Filter = "all" | "low" | "out";

export function InventoryPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const [filter, setFilter] = React.useState<Filter>("all");

  const filtered = products.filter((p) => {
    if (filter === "low") return isLowStock(p);
    if (filter === "out") return isOutOfStock(p);
    return true;
  });

  return (
    <div>
      <PageHeader title="Inventory" description="Stock levels across the catalog." />

      <Tabs
        className="mb-4"
        value={filter}
        onChange={(v) => setFilter(v as Filter)}
        items={[
          { value: "all", label: "All", count: products.length },
          { value: "low", label: "Low stock", count: products.filter(isLowStock).length },
          { value: "out", label: "Out of stock", count: products.filter(isOutOfStock).length },
        ]}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing here" description="No products match this filter." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Stock</Th>
              <Th>Threshold</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((product) => (
              <Tr key={product.id}>
                <Td className="font-medium text-ink-900">{product.name}</Td>
                <Td className="text-ink-500">{product.sku}</Td>
                <Td>{product.stock}</Td>
                <Td>{product.lowStockThreshold}</Td>
                <Td>
                  {isOutOfStock(product) ? (
                    <Badge tone="signal">Out of stock</Badge>
                  ) : isLowStock(product) ? (
                    <Badge tone="signal">Low stock</Badge>
                  ) : (
                    <Badge tone="moss">In stock</Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
