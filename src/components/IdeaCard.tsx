"use client";

import { Star, Edit } from "lucide-react";
import { useState } from "react";
import { IdeaFormMode, IdeaPriority, type IdeaCardData } from "@/lib/types/idea";
import ArchiveIdeaButton from "./ArchiveIdeaButton";
import DeleteIdeaButton from "./DeleteIdeaButton";
import IdeaFormModal from "./IdeaFormModal";
import { cn } from "@/lib/utils";

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
          "bg-surface-container-lowest micro-border rounded-lg p-6 premium-shadow group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative cursor-pointer",
          isHighPriority && "border-t-2 border-t-primary-container"
        )}
      >
        {/* Top Row */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 bg-surface-container-high text-on-secondary-container rounded-sm font-label-meta text-xs">
            {category}
          </span>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
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
          <h2 className="font-card-title text-xl text-on-surface group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="font-body text-body text-secondary line-clamp-3">
            {notes}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="mt-8 pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs font-label-meta text-outline">
          <span>{showArchiveButton ? "Added" : "Archived"} {date}</span>
          <div className="flex items-center gap-2">
            {isHighPriority ? (
              <div className="flex items-center gap-1 text-primary font-bold">
                <Star className="w-4 h-4 fill-primary" />
                <span>High Priority</span>
              </div>
            ) : (
              <div className="flex items-center text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn("w-3.5 h-3.5", i < rating ? "fill-primary" : "text-outline/50")}
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
