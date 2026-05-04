"use client";
import { useEffect, useState } from "react";
import { X, Star, Lock } from "lucide-react";
import { createIdea, getIdeaCategories, updateIdea } from "@/lib/actions/ideas";
import {
  IdeaCategory,
  IdeaFormMode,
  IdeaPriority,
  type IdeaFormData,
} from "@/lib/types/idea";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IdeaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: IdeaFormMode;
  idea?: IdeaFormData;
}

const IDEA_CATEGORIES = [
  IdeaCategory.General,
] as const;
const IDEA_PRIORITIES = [IdeaPriority.Low, IdeaPriority.Medium, IdeaPriority.High] as const;
const RATING_STEPS = [1, 2, 3, 4, 5] as const;

export default function IdeaFormModal({
  isOpen,
  onClose,
  mode = IdeaFormMode.Create,
  idea,
}: IdeaFormModalProps) {
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    IdeaCategory.General,
  ]);
  const [selectedCategory, setSelectedCategory] = useState(
    idea?.category ?? IdeaCategory.General
  );
  const [rating, setRating] = useState(idea?.rating ?? 3);
  const [priority, setPriority] = useState<NonNullable<IdeaFormData["priority"]>>(
    idea?.priority ?? IdeaPriority.Medium
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    async function loadCategories() {
      const categoriesFromDb = await getIdeaCategories();
      const options = [
        ...new Set([
          ...IDEA_CATEGORIES,
          ...categoriesFromDb,
          ...(idea?.category ? [idea.category] : []),
        ]),
      ];
      if (isCancelled) return;

      setCategoryOptions(options);
      const nextCategory = idea?.category ?? options[0] ?? IdeaCategory.General;
      setSelectedCategory(nextCategory);
    }

    void loadCategories();
    setRating(idea?.rating ?? 3);
    setPriority(idea?.priority ?? IdeaPriority.Medium);
    setError(null);
    return () => {
      isCancelled = true;
    };
  }, [isOpen, idea]);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    formData.set("rating", rating.toString());
    formData.set("category", selectedCategory || IdeaCategory.General);
    formData.set("priority", priority ?? IdeaPriority.Medium);

    const result =
      mode === IdeaFormMode.Edit && idea?.id
        ? await updateIdea(idea.id, formData)
        : await createIdea(formData);

    if (result?.success) {
      onClose();
    } else {
      setError(result?.error || "Произошла ошибка при сохранении");
    }
    setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-[6px] flex items-center justify-center p-4">
      <div className="bg-surface border border-primary/30 rounded-[16px] w-full max-w-[600px] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        <ModalHeader mode={mode} onClose={onClose} />

        <form action={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-6">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Title</label>
            <input
              name="title"
              required
              defaultValue={idea?.title ?? ""}
              className="w-full bg-surface-container-lowest border border-primary/60 rounded-lg px-4 py-3 text-sm text-on-surface placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-[0_0_15px_rgba(201,168,76,0.15)] transition-all caret-primary"
              placeholder="Enter a concise title..."
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Category</label>
            <select
              name="category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <PrioritySelector priority={priority} onChange={setPriority} />
            <RatingSelector rating={rating} onChange={setRating} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Notes</label>
            <textarea
              name="notes"
              defaultValue={idea?.notes ?? ""}
              className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-sm text-on-surface placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition-colors resize-y min-h-[120px]"
              placeholder="Expand upon your thoughts here..."
            />
          </div>

          <FormFooter isLoading={isLoading} mode={mode} onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

function ModalHeader({ mode, onClose }: { mode: IdeaFormMode; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-primary/10">
      <h2 className="text-2xl font-light tracking-tight text-on-surface">
        {mode === IdeaFormMode.Edit ? "Refine Your Idea" : "Capture New Inspiration"}
      </h2>
      <button onClick={onClose} className="text-primary hover:text-primary-fixed transition-colors p-2 -mr-2 rounded-full hover:bg-primary/10">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

function PrioritySelector({
  priority,
  onChange,
}: {
  priority: NonNullable<IdeaFormData["priority"]>;
  onChange: (value: NonNullable<IdeaFormData["priority"]>) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Priority</label>
      <div className="flex gap-2 bg-surface-container-lowest p-1 rounded-lg border border-primary/10">
        {IDEA_PRIORITIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-[12px] transition-all",
              priority === item ? "bg-surface text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function RatingSelector({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Rating</label>
      <div className="flex items-center h-full gap-1">
        {RATING_STEPS.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            className="transition-transform hover:scale-110"
          >
            <Star className={cn("w-5 h-5", step <= rating ? "text-primary fill-primary" : "text-zinc-600")} />
          </button>
        ))}
      </div>
    </div>
  );
}

function FormFooter({
  isLoading,
  mode,
  onClose,
}: {
  isLoading: boolean;
  mode: IdeaFormMode;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-lg gold-gradient text-surface font-semibold tracking-wide hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Lock className="w-4 h-4" />
        {isLoading
          ? mode === IdeaFormMode.Edit
            ? "Saving..."
            : "Storing..."
          : mode === IdeaFormMode.Edit
            ? "Save Changes"
            : "Store in Vault"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 rounded-lg bg-transparent border border-transparent text-zinc-400 hover:text-on-surface hover:bg-surface-container transition-colors active:scale-[0.98]"
      >
        Discard
      </button>
    </div>
  );
}
