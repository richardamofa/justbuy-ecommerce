import type { Product } from "@ecommerce/contracts";
import { getEffectivePrice, isLowStock, isOutOfStock } from "@ecommerce/contracts";
import {
    Badge,
    Button,
    EmptyState,
    formatMoney,
    Input,
    Skeleton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@ecommerce/ui";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import * as React from "react";
import { PageHeader } from "../components/PageHeader";
import { ProductFormModal } from "../components/products/ProductFormModal";
import {
    useAdminCategories,
    useAdminProducts,
    useDeleteProduct,
    useSaveProduct,
} from "../hooks/queries";

export function ProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const saveProduct = useSaveProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = React.useState("");
  const [modalProduct, setModalProduct] = React.useState<Product | null | undefined>(undefined);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the product catalog."
        action={
          <Button onClick={() => setModalProduct(null)}>
            <Plus className="h-4 w-4" /> New product
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <Input placeholder="Search products…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No products found" description="Try a different search, or add a new product." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-sm bg-ink-50">
                      {product.images[0] && (
                        <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{product.name}</p>
                      <p className="text-xs text-ink-400">{product.sku}</p>
                    </div>
                  </div>
                </Td>
                <Td>{categoryName(product.categoryId)}</Td>
                <Td>{formatMoney(getEffectivePrice(product), product.currency)}</Td>
                <Td>
                  {isOutOfStock(product) ? (
                    <Badge tone="signal">Out of stock</Badge>
                  ) : isLowStock(product) ? (
                    <Badge tone="signal">{product.stock} left</Badge>
                  ) : (
                    <span className="text-ink-600">{product.stock}</span>
                  )}
                </Td>
                <Td>
                  <Badge tone={product.visibility === "visible" ? "moss" : "neutral"}>{product.visibility}</Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setModalProduct(product)}
                      className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900"
                      aria-label="Edit product"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${product.name}? This cannot be undone.`)) {
                          deleteProduct.mutate(product.id);
                        }
                      }}
                      className="rounded p-1.5 text-ink-400 hover:bg-signal-50 hover:text-signal-DEFAULT"
                      aria-label="Delete product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <ProductFormModal
        isOpen={modalProduct !== undefined}
        onClose={() => setModalProduct(undefined)}
        product={modalProduct ?? null}
        categories={categories}
        isSaving={saveProduct.isPending}
        onSave={(product) => saveProduct.mutate(product, { onSuccess: () => setModalProduct(undefined) })}
      />
    </div>
  );
}
