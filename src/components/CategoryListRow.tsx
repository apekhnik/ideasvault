"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { type CategoryCardModel } from "@/components/CategoriesPageClient";

type CategoryListRowProps = {
  category: CategoryCardModel;
  icon: LucideIcon;
};

export default function CategoryListRow({ category, icon: Icon }: CategoryListRowProps) {
  return (
    <article className="group rounded-xl border border-primary/20 bg-surface px-5 py-4 transition-all duration-200 hover:border-primary/55 hover:shadow-[0_0_16px_rgba(201,168,76,0.12)]">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-surface-container-low">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <h2 className="truncate text-lg font-light text-on-surface">{category.title}</h2>
          </div>

          <p className="mt-1 truncate text-sm text-outline italic">{category.highlightIdea}</p>
        </div>

        <span className="shrink-0 whitespace-nowrap text-xs text-outline self-center">
          {category.count} ideas
        </span>

        <div className="hidden shrink-0 items-center gap-6 text-xs text-outline lg:flex">
          <span>Last entry: {category.lastEntryLabel}</span>
          <span className="truncate max-w-44">
            {category.recentIdeas[0] ? `Recent: ${category.recentIdeas[0]}` : "No recent ideas"}
          </span>
        </div>

        <button
          type="button"
          className="shrink-0 text-outline transition-colors group-hover:text-primary"
          title={`Open ${category.title}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
