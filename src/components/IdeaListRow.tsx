"use client";

import { type IdeaCardData } from "@/lib/types/idea";
import { cn } from "@/lib/utils";

export default function IdeaListRow({ title, category, priority, date }: IdeaCardData) {
  const isHighPriority = priority === "high";

  return (
    <article className="grid grid-cols-12 gap-gutter px-6 py-8 items-center hover:bg-surface-container-low transition-all duration-300 group cursor-pointer">
      <div className="col-span-6 md:col-span-7 flex items-center gap-4">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          isHighPriority ? "bg-primary-container" : "bg-outline-variant"
        )} />
        <h2 className="font-headline-md text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors truncate">
          {title}
        </h2>
      </div>
      
      <div className="col-span-3 md:col-span-3">
        <span className="inline-block px-2 py-1 bg-surface-container-high rounded text-secondary font-label-meta text-xs">
          {category}
        </span>
      </div>
      
      <div className="col-span-3 md:col-span-2 text-right">
        <span className="font-body-md text-xs md:text-sm text-outline font-medium uppercase">
          {date}
        </span>
      </div>
    </article>
  );
}
