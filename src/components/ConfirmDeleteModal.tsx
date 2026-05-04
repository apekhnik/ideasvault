"use client";

import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "Discard Thought?";
const DEFAULT_DESCRIPTION =
  "This action will permanently remove this idea from your sanctuary. This cannot be undone.";

export default function ConfirmDeleteModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="bg-surface border border-primary/20 hover:border-primary/55 transition-all duration-300 rounded-lg p-8 w-full max-w-[420px] relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-error to-transparent opacity-60" />

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-container/20 border border-error/20">
          <Trash2 className="w-6 h-6 text-error" />
        </div>

        <h2 className="text-[24px] font-light tracking-tight text-on-surface mb-2">
          {title}
        </h2>
        <p className="text-sm text-on-surface-variant mb-8 px-4 leading-relaxed">
          {description}
        </p>

        <div className="flex w-full justify-center gap-4 mt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded bg-transparent border border-outline/30 text-on-surface-variant hover:border-primary hover:text-primary transition-all duration-200 text-[12px] uppercase tracking-widest outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="flex-1 py-3 px-6 rounded bg-error-container text-on-error-container border border-error/30 hover:border-error/70 hover:brightness-110 transition-all duration-200 text-[12px] uppercase tracking-widest outline-none focus:ring-1 focus:ring-error focus:ring-offset-1 focus:ring-offset-surface disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
