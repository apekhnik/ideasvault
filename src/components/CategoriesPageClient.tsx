"use client";

import Header from "@/components/Header";
import { createCategory } from "@/lib/actions/ideas";
import MobileBottomNav from "@/components/MobileBottomNav";
import CategoryListRow from "@/components/CategoryListRow";
import { type FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 20,
  },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: -10 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

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
    <div className="flex min-h-screen flex-col bg-background">
      <div className="hidden md:block">
        <Header />
      </div>

      <MobileCategoriesHeader onCreate={() => setIsCreateOpen(true)} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pt-24 md:pt-16 pb-28 md:pb-16">

        {/* Mobile title */}
        <section className="md:hidden mb-6">
          <h1 className="text-3xl font-light tracking-tight text-on-surface">Categories</h1>
          <p className="text-sm text-outline mt-1">Your intellectual space</p>
        </section>

        {/* Desktop header */}
        <motion.header
          initial="hidden"
          animate="show"
          variants={headerVariants}
          className="hidden md:flex mb-16 flex-col md:flex-row md:items-end justify-between gap-8"
          style={{ willChange: "filter, opacity" }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-primary" />
              <span className="font-label-meta text-xs text-primary uppercase tracking-[0.2em]">Organizational System</span>
            </div>
            <h1 className="font-page-title text-4xl md:text-5xl text-on-surface mb-4">Categories</h1>
            <p className="font-body text-lg text-secondary max-w-lg">
              A structured index of intellectual domains — organize, navigate, and expand your vault with precision.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-label-meta text-sm transition-all duration-300 border border-primary/30 text-primary hover:bg-surface-container-low"
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-label-meta text-sm transition-all duration-300 border",
                viewMode === "grid"
                  ? "border-outline-variant text-on-surface bg-surface-container-low shadow-sm"
                  : "bg-transparent text-secondary border-outline-variant/50 hover:bg-surface-container-low hover:text-on-surface"
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid2x2 className="w-4 h-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-label-meta text-sm transition-all duration-300 border",
                viewMode === "list"
                  ? "border-outline-variant text-on-surface bg-surface-container-low shadow-sm"
                  : "bg-transparent text-secondary border-outline-variant/50 hover:bg-surface-container-low hover:text-on-surface"
              )}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </motion.header>

        {hasCategories ? (
          <>
            {/* Mobile cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="md:hidden space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {categories.map((category) => {
                  const Icon = CATEGORY_ICON_MAP[category.iconKey] ?? Lightbulb;
                  return (
                    <motion.article
                      key={category.title}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                      style={{ willChange: "filter, opacity, transform" }}
                      className="bg-surface-container-low border border-primary-container/20 rounded-xl p-5 flex items-center transition-all duration-200 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:border-primary/55 group cursor-pointer"
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
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Desktop grid/list — single container, items stay mounted */}
            <div className={cn(
              "hidden md:block",
              viewMode === "list" && "bg-surface-container-lowest border border-outline-variant/30 rounded-xl premium-shadow overflow-hidden"
            )}>
              {viewMode === "list" && (
                <div className="grid grid-cols-12 gap-gutter px-6 py-4 bg-surface-container-low border-b border-outline-variant/30">
                  <div className="col-span-6 md:col-span-7">
                    <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Category Name</span>
                  </div>
                  <div className="col-span-3 md:col-span-3">
                    <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Ideas</span>
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right">
                    <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Last Entry</span>
                  </div>
                </div>
              )}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-gutter"
                    : "divide-y divide-outline-variant/20"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {categories.map((category) => {
                    const Icon = CATEGORY_ICON_MAP[category.iconKey] ?? Lightbulb;
                    return (
                      <motion.div
                        key={category.title}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                        style={{ willChange: "filter, opacity, transform" }}
                      >
                        {viewMode === "grid" ? (
                          <article className="bg-surface-container-lowest micro-border rounded-lg p-6 premium-shadow group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                              <span className="px-2 py-1 bg-surface-container-high text-on-secondary-container rounded-sm font-label-meta text-xs flex items-center gap-1.5">
                                <Icon className="w-3 h-3" />
                                {category.title}
                              </span>
                              <span className="font-label-meta text-xs text-outline">
                                {category.count} ideas
                              </span>
                            </div>
                            <div className="flex-1">
                              <h2 className="font-card-title text-xl text-on-surface group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                {category.highlightIdea || "No ideas in this category yet."}
                              </h2>
                              {category.recentIdeas.length > 0 && (
                                <p className="font-body text-body text-secondary line-clamp-3">
                                  {category.recentIdeas.join(" · ")}
                                </p>
                              )}
                            </div>
                            <div className="mt-8 pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs font-label-meta text-outline">
                              <span>Last entry: {category.lastEntryLabel}</span>
                              <ArrowRight className="w-4 h-4 group-hover:text-primary transition-colors" />
                            </div>
                          </article>
                        ) : (
                          <CategoryListRow
                            category={category}
                            icon={Icon}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.section
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="bg-surface-container-low micro-border rounded-xl p-10 text-center"
          >
            <h2 className="text-2xl font-light text-on-surface mb-2">No Categories Yet</h2>
            <p className="text-secondary">
              Create your first category to start organizing your vault.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 px-4 py-2 rounded-lg bg-primary text-on-primary hover:brightness-110 transition-all"
            >
              Create Category
            </button>
          </motion.section>
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
    <header className="md:hidden fixed top-0 w-full z-40 bg-surface border-b border-primary/20">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <span className="text-xl font-bold tracking-widest text-primary uppercase">IdeaVault</span>
        <div className="flex items-center gap-4">
          <button
            onClick={onCreate}
            className="text-outline hover:text-primary transition-colors duration-200 active:opacity-80 active:scale-95"
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
      className="md:hidden fixed bottom-24 right-6 w-14 h-14 gold-gradient rounded-full flex items-center justify-center shadow-2xl z-50 active:scale-90 transition-transform"
    >
      <Plus className="w-7 h-7 text-surface" />
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
      <div className="hidden md:block w-full max-w-md bg-surface-container-lowest rounded-xl border border-primary/20 shadow-2xl relative overflow-hidden">
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

      <div className="md:hidden w-full max-w-[500px] bg-surface-container-low border border-primary/20 rounded-t-4xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)] flex flex-col max-h-[88vh] overflow-hidden">
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
          className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-primary/20 text-on-surface placeholder:text-outline focus:border-primary/60 focus:outline-none"
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
          className="w-full px-4 py-3 rounded-lg bg-surface-container-lowest border border-primary/20 text-on-surface placeholder:text-outline resize-none focus:border-primary/60 focus:outline-none"
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
                    : "w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:border-primary/20 hover:bg-surface-container text-outline transition-all"
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
          className="w-full py-4 rounded-lg gold-gradient hover:brightness-110 text-surface font-semibold uppercase tracking-widest text-[13px] transition-all"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-outline uppercase tracking-widest text-[11px] hover:text-on-surface transition-colors"
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
