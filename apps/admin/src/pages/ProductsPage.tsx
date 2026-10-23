import type { Product } from "@ecommerce/contracts";
import { getEffectivePrice, isLowStock, isOutOfStock } from "@ecommerce/contracts";
import {
    Badge,
    Button,
    EmptyState,
    formatMoney,
    Input,
    Modal,
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
import { AdminLoadError } from "../components/AdminLoadError";
import { PageHeader } from "../components/PageHeader";
import { ProductFormModal } from "../components/products/ProductFormModal";
import {
    useAdminCategories,
    useAdminProducts,
    useDeleteProduct,
    useSaveProduct,
} from "../hooks/queries";

export function ProductsPage() {
  const { data: products = [], isLoading, isError: productsError, refetch: refetchProducts } = useAdminProducts();
  const { data: categories = [], isError: categoriesError, refetch: refetchCategories } = useAdminCategories();
  const saveProduct = useSaveProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = React.useState("");
  const [modalProduct, setModalProduct] = React.useState<Product | null | undefined>(undefined);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "—";

  if (productsError || categoriesError) {
    return <div><PageHeader title="Products" description="Manage the product catalog." /><AdminLoadError onRetry={() => { void refetchProducts(); void refetchCategories(); }} /></div>;
  }

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
                        setProductToDelete(product);
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

        <Modal
          isOpen={productToDelete !== null}
          onClose={() => {
            if (!deleteProduct.isPending) {
              setProductToDelete(null);
            }
          }}
          title="Delete product"
          className="max-w-md"
          icon={Trash2}
        >
        <div className="space-y-5">
          <p className="text-sm leading-6 text-ink-600">
            Are you sure you want to delete{" "}
            <strong className="text-ink-900">
              {productToDelete?.name}
            </strong>
            ? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setProductToDelete(null)}
              disabled={deleteProduct.isPending}
            >
              Cancel
            </Button>

            <button
              type="button"
              onClick={() => {
                if (!productToDelete) return;

                deleteProduct.mutate(productToDelete.id, {
                  onSuccess: () => {
                    setProductToDelete(null);
                  },
                });
              }}
              disabled={deleteProduct.isPending}
              className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete product"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
