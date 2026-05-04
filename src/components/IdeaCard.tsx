"use client";

import { Star, Edit, ChevronsUp, ChevronsDown, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { IdeaFormMode, IdeaPriority, type IdeaCardData } from "@/lib/types/idea";
import ArchiveIdeaButton from "./ArchiveIdeaButton";
import DeleteIdeaButton from "./DeleteIdeaButton";
import IdeaFormModal from "./IdeaFormModal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function IdeaCard({
  id,
  title,
  category,
  priority,
  rating,
  notes,
  date,
  showArchiveButton = true,
}: IdeaCardData & { showArchiveButton?: boolean }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const PriorityIcon = priority === IdeaPriority.High ? ChevronsUp : priority === IdeaPriority.Low ? ChevronsDown : Minus;
  const priorityColor =
    priority === IdeaPriority.High
      ? "text-error border-error/30"
      : priority === IdeaPriority.Medium
        ? "text-primary border-primary/30"
        : "text-on-surface-variant border-outline/30";

  return (
    <>
      <div className="bg-surface rounded-xl p-6 border border-primary/20 hover:border-primary/55 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-200 relative group flex flex-col gap-stack-md h-full cursor-pointer">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded-full bg-surface-container border border-outline/30 text-on-surface-variant font-label-meta text-[12px] flex items-center">
              {category}
            </span>
            <span className={cn("px-2 py-1 rounded-full bg-surface-container border font-label-meta text-[12px] flex items-center gap-1", priorityColor)}>
              <PriorityIcon className="w-3 h-3" />
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-outline hover:text-primary transition-colors"
              title="Edit idea"
            >
              <Edit className="w-4 h-4" />
            </button>
            {showArchiveButton && <ArchiveIdeaButton id={id} />}
            <DeleteIdeaButton id={id} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="font-card-title text-[15px] text-on-surface mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="text-outline text-sm line-clamp-3">
            {notes}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant/20">
          <div className="flex items-center text-primary">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("w-4 h-4", i < rating ? "fill-primary" : "text-outline/50")}
              />
            ))}
          </div>
          <span className="font-label-meta text-[12px] text-outline">{date}</span>
        </div>
      </div>

      <IdeaFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode={IdeaFormMode.Edit}
        idea={{ id, title, category, priority, rating, notes }}
      />
    </>
  );
}
