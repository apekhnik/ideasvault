"use client";

import { useMemo, useState } from "react";
import { Grid2x2, List } from "lucide-react";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import IdeaListRow from "@/components/IdeaListRow";
import { type IdeaCardData } from "@/lib/types/idea";

type ArchivesViewMode = "grid" | "list";

export default function ArchivesPageClient({ initialIdeas }: { initialIdeas: IdeaCardData[] }) {
  const [viewMode, setViewMode] = useState<ArchivesViewMode>("grid");
  const ideas = useMemo(() => initialIdeas, [initialIdeas]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-on-surface">Archives</h1>
            <p className="mt-1 text-sm text-outline">Stored ideas moved out of your active vault.</p>
          </div>

          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "w-10 h-10 rounded border border-primary/20 bg-surface flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                  : "w-10 h-10 rounded border border-transparent text-outline hover:text-on-surface transition-colors flex items-center justify-center"
              }
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid2x2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "w-10 h-10 rounded border border-primary/20 bg-surface flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                  : "w-10 h-10 rounded border border-transparent text-outline hover:text-on-surface transition-colors flex items-center justify-center"
              }
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </header>

        {ideas.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} showArchiveButton={false} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ideas.map((idea) => (
                <IdeaListRow key={idea.id} {...idea} />
              ))}
            </div>
          )
        ) : (
          <section className="bg-surface border border-outline-variant/40 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-light text-on-surface mb-2">Archive is Empty</h2>
            <p className="text-outline">Archive ideas from your vault to keep it focused.</p>
          </section>
        )}
      </main>
      <MobileBottomNav active="archives" />
    </div>
  );
}
