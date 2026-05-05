"use client";

import { Star } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type IdeaCardData } from "@/lib/types/idea";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function IdeaListRow({ title, category, priority, rating, notes, date }: IdeaCardData) {
  return (
    <article className="rounded-xl border border-primary/20 bg-surface px-5 py-4 transition-all duration-200 hover:border-primary/55 hover:shadow-[0_0_16px_rgba(201,168,76,0.12)]">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="truncate text-lg font-light text-on-surface">{title}</h2>
            <span className="shrink-0 rounded-full border border-outline/30 bg-surface-container px-2 py-1 text-[12px] text-on-surface-variant">
              {category}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm italic text-outline">{notes || "No description"}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-6 text-xs text-outline lg:flex">
          <span
            className={cn(
              "rounded-full border px-2 py-1 capitalize",
              priority === "high"
                ? "border-error/30 text-error"
                : priority === "medium"
                  ? "border-primary/30 text-primary"
                  : "border-outline/30 text-on-surface-variant"
            )}
          >
            {priority}
          </span>
          <div className="flex items-center text-primary">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("h-4 w-4", i < rating ? "fill-primary" : "text-outline/50")}
              />
            ))}
          </div>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}
