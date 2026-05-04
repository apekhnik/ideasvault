"use client";

import { Archive } from "lucide-react";
import { useState } from "react";
import { archiveIdea } from "@/lib/actions/ideas";

export default function ArchiveIdeaButton({ id }: { id: number }) {
  const [isArchiving, setIsArchiving] = useState(false);

  async function handleArchive() {
    setIsArchiving(true);
    await archiveIdea(id);
    setIsArchiving(false);
  }

  return (
    <button
      onClick={handleArchive}
      disabled={isArchiving}
      className="text-outline hover:text-primary transition-colors disabled:opacity-50"
      title="Archive idea"
    >
      <Archive className="w-4 h-4" />
    </button>
  );
}
