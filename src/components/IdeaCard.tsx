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
  const isHighPriority = priority === IdeaPriority.High;

  return (
    <>
      <div 
        className={cn(
          "bg-[#161616] border border-[#c9a84c]/20 rounded-xl p-stack-md hover:gold-glow transition-all duration-300 flex flex-col h-full relative group cursor-pointer",
          isHighPriority && "border-t-2 border-t-[#c9a84c]"
        )}
      >
        {/* Top Row */}
        <div className="flex justify-between items-start mb-4">
          <span className="font-label-meta text-label-meta px-2 py-1 rounded bg-[#111111] border border-[#c9a84c]/10 text-[#c9a84c]">
            {category}
          </span>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="text-[#555555] hover:text-[#c9a84c] transition-colors"
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
          <h2 className="font-card-title text-card-title text-on-surface group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="font-body text-body text-outline line-clamp-3">
            {notes}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="mt-8 pt-4 border-t border-[#c9a84c]/10 flex justify-between items-center text-label-meta font-label-meta text-[#555555]">
          <span>Archived {date}</span>
          <div className="flex items-center gap-2">
            {isHighPriority ? (
              <div className="flex items-center gap-1 text-[#c9a84c] font-bold">
                <Star className="w-4 h-4 fill-[#c9a84c]" />
                <span>High Priority</span>
              </div>
            ) : (
              <div className="flex items-center text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn("w-3.5 h-3.5", i < rating ? "fill-primary" : "text-[#555555]/50")}
                  />
                ))}
              </div>
            )}
          </div>
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
