"use client";

import { type LucideIcon } from "lucide-react";
import { type CategoryCardModel } from "@/components/CategoriesPageClient";

type CategoryListRowProps = {
  category: CategoryCardModel;
  icon: LucideIcon;
};

export default function CategoryListRow({ category, icon: Icon }: CategoryListRowProps) {
  return (
    <article className="grid grid-cols-12 gap-gutter px-6 py-8 items-center hover:bg-surface-bright transition-all duration-300 group cursor-pointer">
      <div className="col-span-6 md:col-span-7 flex items-center gap-4">
        <Icon className="w-4 h-4 text-primary shrink-0" />
        <h2 className="font-headline-md text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors truncate">
          {category.title}
        </h2>
      </div>

      <div className="col-span-3 md:col-span-3">
        <span className="inline-block px-2 py-1 bg-surface-container-high rounded text-secondary font-label-meta text-xs">
          {category.count} ideas
        </span>
      </div>

      <div className="col-span-3 md:col-span-2 text-right">
        <span className="font-body-md text-xs md:text-sm text-outline font-medium uppercase">
          {category.lastEntryLabel}
        </span>
      </div>
    </article>
  );
}
