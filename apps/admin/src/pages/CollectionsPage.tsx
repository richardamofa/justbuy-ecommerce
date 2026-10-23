import type { Collection } from "@ecommerce/contracts";
import { Badge, Button, EmptyState, Modal, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@ecommerce/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { AdminLoadError } from "../components/AdminLoadError";
import { CollectionFormModal } from "../components/collections/CollectionFormModal";
import { PageHeader } from "../components/PageHeader";
import { useAdminCollections, useAdminProducts, useDeleteCollection, useSaveCollection } from "../hooks/queries";

export function CollectionsPage() {
  const { data: collections = [], isLoading, isError: collectionsError, refetch: refetchCollections } = useAdminCollections();
  const { data: products = [], isError: productsError, refetch: refetchProducts } = useAdminProducts();
  const saveCollection = useSaveCollection();
  const deleteCollection = useDeleteCollection();
  const [modalCollection, setModalCollection] = React.useState<Collection | null | undefined>(undefined);
  const [collectionToDelete, setCollectionToDelete] = React.useState<Collection | null>(null);

  if (collectionsError || productsError) {
    return <div><PageHeader title="Collections" description="Curated groups of products, independent of the category tree." /><AdminLoadError onRetry={() => { void refetchCollections(); void refetchProducts(); }} /></div>;
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Curated groups of products, independent of the category tree."
        action={
          <Button onClick={() => setModalCollection(null)}>
            <Plus className="h-4 w-4" /> New collection
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <EmptyState title="No collections yet" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th>Products</Th>
              <Th>Visibility</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {collections.map((collection) => (
              <Tr key={collection.id}>
                <Td className="font-medium text-ink-900">{collection.name}</Td>
                <Td className="text-ink-500">{collection.slug}</Td>
                <Td>{collection.productIds.length}</Td>
                <Td>
                  <Badge tone={collection.isVisible ? "moss" : "neutral"}>{collection.isVisible ? "Visible" : "Hidden"}</Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setModalCollection(collection)}
                      className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900"
                      aria-label="Edit collection"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setCollectionToDelete(collection);
                      }}
                      className="rounded p-1.5 text-ink-400 hover:bg-signal-50 hover:text-signal-DEFAULT"
                      aria-label="Delete collection"
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

      <CollectionFormModal
        isOpen={modalCollection !== undefined}
        onClose={() => setModalCollection(undefined)}
        collection={modalCollection ?? null}
        products={products}
        isSaving={saveCollection.isPending}
        onSave={(collection) => saveCollection.mutate(collection, { onSuccess: () => setModalCollection(undefined) })}
      />
      <Modal isOpen={collectionToDelete !== null} onClose={() => !deleteCollection.isPending && setCollectionToDelete(null)} title="Delete collection">
        <div className="space-y-5">
          <p className="text-sm leading-6 text-ink-600">Delete <strong className="text-ink-900">{collectionToDelete?.name}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="outline" onClick={() => setCollectionToDelete(null)} disabled={deleteCollection.isPending}>Cancel</Button>
            <Button variant="danger" isLoading={deleteCollection.isPending} onClick={() => collectionToDelete && deleteCollection.mutate(collectionToDelete.id, { onSuccess: () => setCollectionToDelete(null) })}>Delete collection</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
