import type { HomepageSection } from "@ecommerce/contracts";
import {
  Button,
  Card,
  CardContent,
  Modal,
  Select,
  Skeleton,
  useToast,
} from "@ecommerce/ui";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { PageHeader } from "../components/PageHeader";
import { SectionEditModal } from "../components/sections/SectionEditModal";
import {
  useAdminCategories,
  useAdminProducts,
  useAdminSections,
  useSaveSections,
} from "../hooks/queries";
import { sectionTypeLabels } from "../mocks/homepage";

function createDefaultSection(
  type: HomepageSection["type"],
  position: number,
): HomepageSection {
  const base = {
    id: `sec_${Date.now()}`,
    position,
    isEnabled: true,
    title: "New section",
  };

  if (type === "hero") {
    return {
      ...base,
      type: "hero",
      banners: [],
    };
  }

  if (type === "product-grid") {
    return {
      ...base,
      type: "product-grid",
      products: [],
      productIds: [],
    };
  }

  if (type === "product-carousel") {
    return {
      ...base,
      type: "product-carousel",
      products: [],
      productIds: [],
    };
  }

  if (type === "category-grid") {
    return {
      ...base,
      type: "category-grid",
      categories: [],
      categoryIds: [],
    };
  }

  if (type === "collection") {
    return {
      ...base,
      type: "collection",
      products: [],
    };
  }

  if (type === "banner") {
    return {
      ...base,
      type: "banner",
      image: {
        id: "img",
        url: "",
        alt: "",
        position: 0,
      },
    };
  }

  if (type === "rich-content") {
    return {
      ...base,
      type: "rich-content",
      html: "",
    };
  }

  return {
    ...base,
    type: "newsletter",
    heading: "Stay in the loop",
  };
}

export function SectionsPage() {
  const { toast } = useToast();

  const { data: sections = [], isLoading } = useAdminSections();
  const { data: products = [] } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const saveSections = useSaveSections();

  const [local, setLocal] = React.useState<HomepageSection[] | null>(null);
  const [editing, setEditing] = React.useState<HomepageSection | null>(null);
  const [pendingRemoval, setPendingRemoval] =
    React.useState<HomepageSection | null>(null);
  const [newType, setNewType] =
    React.useState<HomepageSection["type"]>("product-grid");

  React.useEffect(() => {
    if (sections.length && !local) {
      setLocal(sections);
    }
  }, [sections, local]);

  const list = local ?? sections;

  function persist(
    next: HomepageSection[],
    successMessage = "Homepage changes have been saved.",
  ) {
    const previous = list;

    // Optimistic update
    setLocal(next);

    saveSections.mutate(next, {
      onSuccess: () => {
        toast({
          type: "success",
          title: "Homepage updated",
          message: successMessage,
        });
      },

      onError: (error) => {
        // Roll back optimistic update
        setLocal(previous);

        toast({
          type: "error",
          title: "Couldn't save changes",
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong while saving the homepage.",
        });
      },
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...list];
    const target = index + dir;

    if (target < 0 || target >= next.length) {
      return;
    }

    const temp = next[index]!;
    next[index] = next[target]!;
    next[target] = temp;

    persist(
      next.map((section, position) => ({
        ...section,
        position,
      })),
      "Section order has been updated.",
    );
  }

  function toggleEnabled(id: string) {
    persist(
      list.map((section) =>
        section.id === id
          ? {
              ...section,
              isEnabled: !section.isEnabled,
            }
          : section,
      ),
      "Section visibility has been updated.",
    );
  }

  function remove(id: string) {
    persist(
      list
        .filter((section) => section.id !== id)
        .map((section, position) => ({
          ...section,
          position,
        })),
      "The section has been removed from the homepage.",
    );
  }

  function confirmRemoval() {
    if (!pendingRemoval) {
      return;
    }

    remove(pendingRemoval.id);
    setPendingRemoval(null);
  }

  function addSection() {
    persist(
      [...list, createDefaultSection(newType, list.length)],
      "New section has been added to the homepage.",
    );
  }

  function saveEdited(updated: HomepageSection) {
    persist(
      list.map((section) =>
        section.id === updated.id ? updated : section,
      ),
      "Section changes have been saved.",
    );
  }

  return (
    <div>
      <PageHeader
        title="Homepage sections"
        description="Control what appears on the storefront homepage, and in what order."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <label
              className="mb-1.5 block text-sm font-medium text-ink-800"
              htmlFor="newType"
            >
              Section type
            </label>

            <Select
              id="newType"
              value={newType}
              onChange={(event) =>
                setNewType(
                  event.target.value as HomepageSection["type"],
                )
              }
            >
              {Object.entries(sectionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <Button
            onClick={addSection}
            disabled={saveSections.isPending}
          >
            <Plus className="h-4 w-4" />
            Add section
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-16 w-full"
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {list
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((section, index) => (
              <li key={section.id}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink-900">
                        {section.title ||
                          sectionTypeLabels[section.type]}
                      </p>

                      <p className="text-xs text-ink-400">
                        {sectionTypeLabels[section.type]}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={
                          index === 0 || saveSections.isPending
                        }
                        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={
                          index === list.length - 1 ||
                          saveSections.isPending
                        }
                        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <label className="mx-2 flex items-center gap-1.5 text-xs text-ink-500">
                        <input
                          type="checkbox"
                          checked={section.isEnabled}
                          onChange={() =>
                            toggleEnabled(section.id)
                          }
                          disabled={saveSections.isPending}
                        />
                        Enabled
                      </label>

                      <button
                        type="button"
                        onClick={() => setEditing(section)}
                        disabled={saveSections.isPending}
                        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                        aria-label="Edit section"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingRemoval(section)}
                        disabled={saveSections.isPending}
                        className="rounded p-1.5 text-ink-400 hover:bg-signal-50 hover:text-signal-DEFAULT disabled:opacity-30"
                        aria-label="Remove section"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
        </ul>
      )}

      <SectionEditModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        section={editing}
        products={products}
        categories={categories}
        onSave={saveEdited}
      />

      <Modal
        isOpen={pendingRemoval !== null}
        onClose={() => {
          if (!saveSections.isPending) {
            setPendingRemoval(null);
          }
        }}
        title="Remove homepage section"
        className="max-w-md"
      >
        <div className="space-y-5">
          <div className="rounded border border-signal-100 bg-signal-50 p-4">
            <p className="text-sm font-semibold text-signal-DEFAULT">
              This action changes the storefront
            </p>

            <p className="mt-1 text-sm text-ink-600">
              “
              {pendingRemoval?.title ||
                (pendingRemoval &&
                  sectionTypeLabels[pendingRemoval.type])}
              ” will be removed from the homepage. This cannot be
              undone from this screen.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setPendingRemoval(null)}
              disabled={saveSections.isPending}
            >
              Keep section
            </Button>

            <Button
              variant="danger"
              onClick={confirmRemoval}
              disabled={saveSections.isPending}
            >
              {saveSections.isPending
                ? "Removing..."
                : "Remove section"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}