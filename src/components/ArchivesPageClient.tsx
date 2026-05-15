"use client";

import { useMemo, useState } from "react";
import { Grid2x2, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import IdeaListRow from "@/components/IdeaListRow";
import { type IdeaCardData } from "@/lib/types/idea";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ArchivesViewMode = "grid" | "list";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(8px)", 
    y: 20 
  },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
};

const headerVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: -10 },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function ArchivesPageClient({ initialIdeas }: { initialIdeas: IdeaCardData[] }) {
  const [viewMode, setViewMode] = useState<ArchivesViewMode>("grid");
  const ideas = useMemo(() => initialIdeas, [initialIdeas]);
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialIdeas.map(i => i.category)));
    return ["All Time", ...cats];
  }, [initialIdeas]);
  const [activeCategory, setActiveCategory] = useState("All Time");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <motion.header 
          initial="hidden"
          animate="show"
          variants={headerVariants}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          style={{ willChange: "filter, opacity" }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-primary"></span>
              <span className="font-label-meta text-xs text-primary uppercase tracking-[0.2em]">Institutional Memory</span>
            </div>
            <h1 className="font-page-title text-4xl md:text-5xl text-on-surface mb-4">Archive</h1>
            <p className="font-body text-lg text-secondary max-w-lg">
              A curated repository of past explorations, shelved concepts, and foundational sketches preserved for future synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-label-meta text-sm transition-all duration-300 border",
                viewMode === "grid"
                  ? "border-outline-variant text-on-surface bg-surface-container-low shadow-sm"
                  : "bg-transparent text-secondary border-outline-variant/50 hover:bg-surface-container-low hover:text-on-surface"
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid2x2 className="w-4 h-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-label-meta text-sm transition-all duration-300 border",
                viewMode === "list"
                  ? "border-outline-variant text-on-surface bg-surface-container-low shadow-sm"
                  : "bg-transparent text-secondary border-outline-variant/50 hover:bg-surface-container-low hover:text-on-surface"
              )}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </motion.header>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <span className="font-label-meta text-label-meta text-outline uppercase tracking-widest text-[10px]">Filter by:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full font-label-meta text-label-meta micro-border transition-colors",
                activeCategory === cat
                  ? "bg-surface-container-highest text-on-surface"
                  : "bg-surface-container-low text-secondary hover:bg-primary-fixed"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {ideas.length > 0 ? (
          <div className={cn(
            viewMode === "list" && "bg-surface-container-lowest border border-outline-variant/30 rounded-xl premium-shadow overflow-hidden"
          )}>
            {viewMode === "list" && (
              <div className="grid grid-cols-12 gap-gutter px-6 py-4 bg-surface-container-low border-b border-outline-variant/30">
                <div className="col-span-6 md:col-span-7">
                  <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Concept Title</span>
                </div>
                <div className="col-span-3 md:col-span-3">
                  <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Classification</span>
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Archived</span>
                </div>
              </div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={cn(
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" : "divide-y divide-outline-variant/20"
              )}
            >
              <AnimatePresence mode="popLayout">
                {ideas
                  .filter(idea => activeCategory === "All Time" || idea.category === activeCategory)
                  .map((idea) => (
                  <motion.div
                    key={idea.id}
                    variants={itemVariants}
                    layout
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                    style={{ willChange: "filter, opacity, transform" }}
                  >
                    {viewMode === "grid" ? (
                      <IdeaCard key={idea.id} {...idea} showArchiveButton={false} />
                    ) : (
                      <IdeaListRow key={idea.id} {...idea} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <motion.section 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="bg-surface-container-low micro-border rounded-xl p-10 text-center"
          >
            <h2 className="text-2xl font-light text-on-surface mb-2">Archive is Empty</h2>
            <p className="text-secondary">Archive ideas from your vault to keep it focused.</p>
          </motion.section>
        )}
      </main>
      <MobileBottomNav active="archives" />
    </div>
  );
}
