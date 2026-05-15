"use client";

import Header from "@/components/Header";
import { createCategory } from "@/lib/actions/ideas";
import MobileBottomNav from "@/components/MobileBottomNav";
import CategoryListRow from "@/components/CategoryListRow";
import { type FormEvent, useState } from "react";
import {
  Archive,
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  FolderKanban,
  Grid2x2,
  Lightbulb,
  List,
  Plus,
  Search,
  UserRound,
  X,
  type LucideIcon,
  Palette,
  Gem,
  BookOpenText,
  Fingerprint,
  Sparkles,
} from "lucide-react";

export type CategoryCardModel = {
  title: string;
  count: number;
  lastEntryLabel: string;
  recentIdeas: string[];
  highlightIdea: string;
  iconKey: string;
};

type CategoriesViewMode = "grid" | "list";

type CreateCategoryInput = {
  title: string;
  description: string;
  iconKey: string;
};

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Business: BriefcaseBusiness,
  Personal: UserRound,
  Projects: FolderKanban,
  Design: Lightbulb,
  Architecture: FolderKanban,
  Research: Lightbulb,
  Other: Lightbulb,
  inventory: Archive,
  diamond: Gem,
  architecture: FolderKanban,
  stories: BookOpenText,
  palette: Palette,
  fingerprint: Fingerprint,
  sparkles: Sparkles,
  bulb: Lightbulb,
};

const MODAL_ICON_CHOICES: Array<{ key: string; icon: LucideIcon }> = [
  { key: "inventory", icon: Archive },
  { key: "diamond", icon: Gem },
  { key: "architecture", icon: FolderKanban },
  { key: "stories", icon: BookOpenText },
  { key: "palette", icon: Palette },
  { key: "fingerprint", icon: Fingerprint },
  { key: "sparkles", icon: Sparkles },
  { key: "bulb", icon: Lightbulb },
];

export default function CategoriesPageClient({ initialCategories }: { initialCategories: CategoryCardModel[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [viewMode, setViewMode] = useState<CategoriesViewMode>("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const hasCategories = categories.length > 0;

  async function handleCreateCategory(input: CreateCategoryInput): Promise<boolean> {
    setCreateError(null);
    const normalizedTitle = input.title.trim();
    if (!normalizedTitle) return false;

    const exists = categories.some(
      (category) => category.title.toLowerCase() === normalizedTitle.toLowerCase()
    );
    if (exists) {
      setCreateError("Category already exists");
      return false;
    }

    const result = await createCategory({
      title: normalizedTitle,
      description: input.description,
      iconKey: input.iconKey,
    });
    if (!result.success) {
      setCreateError(result.error || "Failed to create category");
      return false;
    }

    setCategories((prev) => [
      {
        title: normalizedTitle,
        count: 0,
        lastEntryLabel: "just now",
        recentIdeas: [],
        highlightIdea:
          result.category?.description || input.description.trim() || "No ideas in this category yet.",
        iconKey: result.category?.iconKey || input.iconKey,
      },
      ...prev,
    ]);
    setIsCreateOpen(false);
    return true;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden md:block">
        <Header />
      </div>

      <MobileCategoriesHeader onCreate={() => setIsCreateOpen(true)} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 pt-24 md:pt-12 pb-28 md:pb-16">
        <section className="md:hidden mb-6">
          <header className="mb-6">
            <h1 className="text-3xl font-light tracking-tight text-on-surface">Categories</h1>
            <p className="text-sm text-outline mt-1">Your intellectual space</p>
          </header>

          <div className="mb-6">
            <div className="bg-[#111111] border border-outline-variant rounded-xl flex items-center px-4 py-3">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface text-sm w-full placeholder:text-outline-variant"
                placeholder="Search archives..."
                type="text"
              />
            </div>
          </div>
        </section>

        <section className="hidden md:block">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-on-surface">
                Categories
              </h1>
              <p className="text-sm text-outline mt-1">
                Organize and navigate your intellectual space.
              </p>
            </div>

            <div className="hidden sm:flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-4 h-10 rounded border border-primary/20 bg-surface text-primary hover:bg-surface-container-high transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Category
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "w-10 h-10 rounded border border-primary/20 bg-surface flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                    : "w-10 h-10 rounded border border-transparent text-outline hover:text-on-surface transition-colors flex items-center justify-center"
                }
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "w-10 h-10 rounded border border-primary/20 bg-surface flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                    : "w-10 h-10 rounded border border-transparent text-outline hover:text-on-surface transition-colors flex items-center justify-center"
                }
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </header>
        </section>

        {hasCategories ? (
          <>
            <div className="md:hidden space-y-6">
              {categories.map((category) => {
                const Icon = CATEGORY_ICON_MAP[category.iconKey] ?? Lightbulb;
                return (
                  <article
                    key={category.title}
                    className="bg-[#161616] border border-primary-container/20 rounded-xl p-5 flex items-center transition-all duration-200 ease-in-out hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:border-primary/55 group cursor-pointer"
                  >
                    <div className="mr-5">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1 gap-3">
                        <h2 className="text-[18px] font-light text-on-surface truncate">
                          {category.title}
                        </h2>
                        <span className="text-[12px] text-outline-variant uppercase whitespace-nowrap">
                          {category.count} Ideas
                        </span>
                      </div>
                      <p className="text-outline text-[13px] line-clamp-1 italic">
                        {category.highlightIdea}
                      </p>
                    </div>
                    <div className="ml-4">
                      <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
                    </div>
                  </article>
                );
              })}
            </div>

            {viewMode === "grid" ? (
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                  const Icon = CATEGORY_ICON_MAP[category.iconKey] ?? Lightbulb;
                  return (
                    <article
                      key={category.title}
                      className="group bg-surface border border-primary/20 rounded-xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:border-primary/55 flex flex-col h-full min-h-[320px]"
                    >
                      <div className="absolute -right-12 -top-12 text-primary/5 pointer-events-none">
                        <Icon className="w-40 h-40" />
                      </div>

                      <div className="flex justify-between items-start mb-auto relative z-10">
                        <div>
                          <h2 className="text-3xl font-light tracking-wide text-primary">
                            {category.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-[12px] text-outline bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant">
                              {category.count} Ideas Stored
                            </span>
                            <span className="text-[12px] text-outline">
                              Last Entry: {category.lastEntryLabel}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="text-outline group-hover:text-primary transition-colors"
                          title={`Open ${category.title}`}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-8 relative z-10">
                        <h3 className="text-[12px] text-outline uppercase tracking-wider mb-4 border-b border-primary/10 pb-2">
                          Recent Ideas
                        </h3>
                        {category.recentIdeas.length > 0 ? (
                          <ul className="space-y-3">
                            {category.recentIdeas.map((ideaTitle) => (
                              <li
                                key={ideaTitle}
                                className="text-[15px] text-on-surface truncate hover:text-primary cursor-pointer transition-colors"
                                title={ideaTitle}
                              >
                                {ideaTitle}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-outline">No ideas in this category yet.</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="hidden md:flex md:flex-col gap-3">
                {categories.map((category) => (
                  <CategoryListRow
                    key={category.title}
                    category={category}
                    icon={CATEGORY_ICON_MAP[category.iconKey] ?? Lightbulb}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <section className="bg-surface border border-outline-variant/40 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-light text-on-surface mb-2">No Categories Yet</h2>
            <p className="text-outline">
              Create your first category to start organizing your vault.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 px-4 py-2 rounded-lg bg-primary text-on-primary hover:brightness-110 transition-all"
            >
              Create Category
            </button>
          </section>
        )}
      </main>

      <MobileCategoriesFab onCreate={() => setIsCreateOpen(true)} />
      <MobileBottomNav active="categories" />

      <CreateCategoryModal
        isOpen={isCreateOpen}
        error={createError}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateError(null);
        }}
        onCreate={handleCreateCategory}
      />
    </div>
  );
}

function MobileCategoriesHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="md:hidden fixed top-0 w-full z-40 bg-zinc-950 border-b border-amber-500/20">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <span className="text-xl font-bold tracking-widest text-amber-500 uppercase">IdeaVault</span>
        <div className="flex items-center gap-4">
          <button
            onClick={onCreate}
            className="text-zinc-500 hover:text-amber-200 transition-colors duration-200 active:opacity-80 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 bg-surface-container-highest" />
        </div>
      </div>
    </header>
  );
}

function MobileCategoriesFab({ onCreate }: { onCreate: () => void }) {
  return (
    <button
      onClick={onCreate}
      className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl z-50 active:scale-90 transition-transform"
    >
      <Plus className="w-7 h-7 text-zinc-950" />
    </button>
  );
}

function CreateCategoryModal({
  isOpen,
  error,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  error: string | null;
  onClose: () => void;
  onCreate: (input: CreateCategoryInput) => Promise<boolean>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconKey, setIconKey] = useState("inventory");

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    const created = await onCreate({ title, description, iconKey });
    if (created) {
      setTitle("");
      setDescription("");
      setIconKey("inventory");
    }
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="hidden md:block w-full max-w-md bg-[#111111] rounded-xl border border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-on-surface mb-2">Create New Category</h2>
            <p className="text-[12px] text-outline uppercase">
              Define a new repository for your intellectual assets
            </p>
          </div>
          <CreateCategoryForm
            error={error}
            title={title}
            description={description}
            iconKey={iconKey}
            setTitle={setTitle}
            setDescription={setDescription}
            setIconKey={setIconKey}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitLabel="Establish Category"
            cancelLabel="Cancel"
          />
        </div>
      </div>

      <div className="md:hidden w-full max-w-[500px] bg-[#161616] border border-primary/20 rounded-t-4xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[88vh] overflow-hidden">
        <div className="w-12 h-1 bg-primary/20 rounded-full mx-auto mt-4 mb-2" />
        <div className="px-8 pt-6 pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-light text-on-surface">Create New Category</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-8 py-4 pb-10">
          <CreateCategoryForm
            error={error}
            title={title}
            description={description}
            iconKey={iconKey}
            setTitle={setTitle}
            setDescription={setDescription}
            setIconKey={setIconKey}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitLabel="Create Category"
            cancelLabel="Close"
          />
        </div>
      </div>
    </div>
  );
}

function CreateCategoryForm({
  error,
  title,
  description,
  iconKey,
  setTitle,
  setDescription,
  setIconKey,
  onClose,
  onSubmit,
  submitLabel,
  cancelLabel,
}: {
  error: string | null;
  title: string;
  description: string;
  iconKey: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setIconKey: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  cancelLabel: string;
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-[12px] text-primary/80 uppercase">Category Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-primary/20 text-on-surface placeholder:text-zinc-700 focus:border-primary/60 focus:outline-none"
          placeholder="e.g., Strategic Planning"
          type="text"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[12px] text-primary/80 uppercase">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#111111] border border-primary/20 text-on-surface placeholder:text-zinc-700 resize-none focus:border-primary/60 focus:outline-none"
          placeholder="Briefly describe the purpose of this vault..."
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <label className="text-[12px] text-primary/80 uppercase">Icon Selection</label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {MODAL_ICON_CHOICES.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === iconKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setIconKey(item.key)}
                className={
                  isActive
                    ? "w-10 h-10 flex items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary"
                    : "w-10 h-10 flex items-center justify-center rounded-lg border border-white/5 hover:border-primary/20 hover:bg-white/5 text-zinc-500 transition-all"
                }
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button
          type="submit"
          className="w-full py-4 rounded-lg bg-linear-to-br from-[#e6c364] to-primary-container hover:brightness-110 text-zinc-950 font-semibold uppercase tracking-widest text-[13px] transition-all"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-zinc-500 uppercase tracking-widest text-[11px] hover:text-zinc-300 transition-colors"
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
