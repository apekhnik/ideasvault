"use client";

import { useMemo, useState } from "react";
import { Grid2x2, List } from "lucide-react";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import IdeaListRow from "@/components/IdeaListRow";
import EmptyVaultState from "@/components/EmptyVaultState";
import MobileBottomNav from "@/components/MobileBottomNav";
import VaultToolbar from "@/components/VaultToolbar";
import { type IdeaCardData } from "@/lib/types/idea";

type HomeViewMode = "grid" | "list";

export default function HomePageClient({ initialIdeas }: { initialIdeas: IdeaCardData[] }) {
  const [viewMode, setViewMode] = useState<HomeViewMode>("grid");
  const ideas = useMemo(() => initialIdeas, [initialIdeas]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <VaultToolbar
          actions={
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
          }
        />

        {ideas.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
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
          <EmptyVaultState />
        )}
      </main>
      <MobileBottomNav active="vault" />
    </div>
  );
}
