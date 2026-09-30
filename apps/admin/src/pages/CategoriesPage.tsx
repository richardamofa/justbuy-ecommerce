import type { Category } from "@ecommerce/contracts";
import { Badge, Button, EmptyState, Modal, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@ecommerce/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { PageHeader } from "../components/PageHeader";
import { CategoryFormModal } from "../components/categories/CategoryFormModal";
import { useAdminCategories, useDeleteCategory, useSaveCategory } from "../hooks/queries";

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const saveCategory = useSaveCategory();
  const deleteCategory = useDeleteCategory();
  const [modalCategory, setModalCategory] = React.useState<Category | null | undefined>(undefined);
  const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);

  const parentName = (id: string | null) => (id ? categories.find((c) => c.id === id)?.name ?? "—" : "—");

  return (
    <div>
      <PageHeader
        title="Categories"
        description="The permanent store taxonomy."
        action={
          <Button onClick={() => setModalCategory(null)}>
            <Plus className="h-4 w-4" /> New category
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Parent</Th>
              <Th>Slug</Th>
              <Th>Visibility</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((category) => (
              <Tr key={category.id}>
                <Td className="font-medium text-ink-900">{category.name}</Td>
                <Td>{parentName(category.parentId)}</Td>
                <Td className="text-ink-500">{category.slug}</Td>
                <Td>
                  <Badge tone={category.isVisible ? "moss" : "neutral"}>{category.isVisible ? "Visible" : "Hidden"}</Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setModalCategory(category)}
                      className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900"
                      aria-label="Edit category"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setCategoryToDelete(category);
                      }}
                      className="rounded p-1.5 text-ink-400 hover:bg-signal-50 hover:text-signal-DEFAULT"
                      aria-label="Delete category"
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

      <CategoryFormModal
        isOpen={modalCategory !== undefined}
        onClose={() => setModalCategory(undefined)}
        category={modalCategory ?? null}
        categories={categories}
        isSaving={saveCategory.isPending}
        onSave={(category) => saveCategory.mutate(category, { onSuccess: () => setModalCategory(undefined) })}
      />
      <Modal isOpen={categoryToDelete !== null} onClose={() => !deleteCategory.isPending && setCategoryToDelete(null)} title="Delete category">
        <div className="space-y-5">
          <p className="text-sm leading-6 text-ink-600">Delete <strong className="text-ink-900">{categoryToDelete?.name}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="outline" onClick={() => setCategoryToDelete(null)} disabled={deleteCategory.isPending}>Cancel</Button>
            <Button variant="danger" isLoading={deleteCategory.isPending} onClick={() => categoryToDelete && deleteCategory.mutate(categoryToDelete.id, { onSuccess: () => setCategoryToDelete(null) })}>Delete category</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
