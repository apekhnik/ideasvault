"use client";
import { Trash2 } from "lucide-react";
import { deleteIdea } from "@/lib/actions/ideas";
import { useState } from "react";

export default function DeleteIdeaButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this idea?")) {
      setIsDeleting(true);
      await deleteIdea(id);
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-outline hover:text-error transition-colors disabled:opacity-50"
      title="Delete idea"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
