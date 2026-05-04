"use client";
import { Trash2 } from "lucide-react";
import { deleteIdea } from "@/lib/actions/ideas";
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function DeleteIdeaButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, isDeleting]);

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    await deleteIdea(id);
    setIsDeleting(false);
    setIsModalOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        className="text-outline hover:text-error transition-colors disabled:opacity-50"
        title="Delete idea"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
