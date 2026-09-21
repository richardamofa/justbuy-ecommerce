import type { HomepageSection } from "@ecommerce/contracts";
import { Button, Card, CardContent, Modal, Select, Skeleton } from "@ecommerce/ui";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { PageHeader } from "../components/PageHeader";
import { SectionEditModal } from "../components/sections/SectionEditModal";
import { useAdminCategories, useAdminProducts, useAdminSections, useSaveSections } from "../hooks/queries";
import { sectionTypeLabels } from "../mocks/homepage";

function createDefaultSection(type: HomepageSection["type"], position: number): HomepageSection {
  const base = { id: `sec_${Date.now()}`, position, isEnabled: true, title: "New section" };
  if (type === "hero") return { ...base, type: "hero", banners: [] };
  if (type === "product-grid") return { ...base, type: "product-grid", products: [], productIds: [] };
  if (type === "product-carousel") return { ...base, type: "product-carousel", products: [], productIds: [] };
  if (type === "category-grid") return { ...base, type: "category-grid", categories: [], categoryIds: [] };
  if (type === "collection") return { ...base, type: "collection", products: [] };
  if (type === "banner") return { ...base, type: "banner", image: { id: "img", url: "", alt: "", position: 0 } };
  if (type === "rich-content") return { ...base, type: "rich-content", html: "" };
  return { ...base, type: "newsletter", heading: "Stay in the loop" };
}

export function SectionsPage() {
  const { data: sections = [], isLoading } = useAdminSections();
  const { data: products = [] } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const saveSections = useSaveSections();

  const [local, setLocal] = React.useState<HomepageSection[] | null>(null);
  const [editing, setEditing] = React.useState<HomepageSection | null>(null);
  const [pendingRemoval, setPendingRemoval] = React.useState<HomepageSection | null>(null);
  const [newType, setNewType] = React.useState<HomepageSection["type"]>("product-grid");

  React.useEffect(() => {
    if (sections.length && !local) setLocal(sections);
  }, [sections, local]);

  const list = local ?? sections;

  function persist(next: HomepageSection[]) {
    setLocal(next);
    saveSections.mutate(next);
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...list];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const temp = next[index]!;
    next[index] = next[target]!;
    next[target] = temp;
    persist(next.map((s, i) => ({ ...s, position: i })));
  }

  function toggleEnabled(id: string) {
    persist(list.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)));
  }

  function remove(id: string) {
    persist(list.filter((s) => s.id !== id).map((s, i) => ({ ...s, position: i })));
  }

  function confirmRemoval() {
    if (!pendingRemoval) return;
    remove(pendingRemoval.id);
    setPendingRemoval(null);
  }

  function addSection() {
    persist([...list, createDefaultSection(newType, list.length)]);
  }

  function saveEdited(updated: HomepageSection) {
    persist(list.map((s) => (s.id === updated.id ? updated : s)));
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
            <label className="mb-1.5 block text-sm font-medium text-ink-800" htmlFor="newType">
              Section type
            </label>
            <Select id="newType" value={newType} onChange={(e) => setNewType(e.target.value as HomepageSection["type"])}>
              {Object.entries(sectionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <Button onClick={addSection}>
            <Plus className="h-4 w-4" /> Add section
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
                      <p className="text-sm font-medium text-ink-900">{section.title || sectionTypeLabels[section.type]}</p>
                      <p className="text-xs text-ink-400">{sectionTypeLabels[section.type]}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === list.length - 1}
                        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <label className="mx-2 flex items-center gap-1.5 text-xs text-ink-500">
                        <input type="checkbox" checked={section.isEnabled} onChange={() => toggleEnabled(section.id)} />
                        Enabled
                      </label>
                      <button
                        onClick={() => setEditing(section)}
                        className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900"
                        aria-label="Edit section"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPendingRemoval(section)}
                        className="rounded p-1.5 text-ink-400 hover:bg-signal-50 hover:text-signal-DEFAULT"
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
        onClose={() => setPendingRemoval(null)}
        title="Remove homepage section"
        className="max-w-md"
      >
        <div className="space-y-5">
          <div className="rounded border border-signal-100 bg-signal-50 p-4">
            <p className="text-sm font-semibold text-signal-DEFAULT">This action changes the storefront</p>
            <p className="mt-1 text-sm text-ink-600">
              “{pendingRemoval?.title || (pendingRemoval && sectionTypeLabels[pendingRemoval.type])}” will be removed from the homepage. This cannot be undone from this screen.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingRemoval(null)}>Keep section</Button>
            <Button variant="danger" onClick={confirmRemoval}>Remove section</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
