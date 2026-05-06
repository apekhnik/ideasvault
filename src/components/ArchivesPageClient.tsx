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
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <motion.header 
          initial="hidden"
          animate="show"
          variants={headerVariants}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
          style={{ willChange: "filter, opacity" }}
        >
          <div>
            <h1 className="font-page-title text-3xl md:text-page-title text-on-surface mb-2">Knowledge Archive</h1>
            <p className="font-body text-body text-[#555555]">A curated collection of your past brilliance and inspirations.</p>
          </div>

          <div className="flex items-center gap-2 bg-[#111111] p-1 rounded-lg border border-[#c9a84c]/20">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded font-label-meta text-label-meta transition-all duration-300",
                viewMode === "grid"
                  ? "bg-primary-container text-on-primary-container"
                  : "text-[#555555] hover:text-[#f0ead6] hover:bg-[#161616]"
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
                "flex items-center gap-2 px-4 py-2 rounded font-label-meta text-label-meta transition-all duration-300",
                viewMode === "list"
                  ? "bg-primary-container text-on-primary-container"
                  : "text-[#555555] hover:text-[#f0ead6] hover:bg-[#161616]"
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
          <span className="font-label-meta text-label-meta text-[#555555] uppercase tracking-widest text-[10px]">Filter by:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full font-label-meta text-label-meta border border-[#c9a84c]/20 transition-colors",
                activeCategory === cat
                  ? "bg-[#161616] text-[#c9a84c]"
                  : "bg-[#111111] text-[#555555] hover:text-[#f0ead6] hover:bg-[#161616]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {ideas.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" : "flex flex-col gap-3"}
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
        ) : (
          <motion.section 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="bg-[#161616] border border-[#c9a84c]/20 rounded-xl p-10 text-center"
          >
            <h2 className="text-2xl font-light text-on-surface mb-2">Archive is Empty</h2>
            <p className="text-[#555555]">Archive ideas from your vault to keep it focused.</p>
          </motion.section>
        )}
      </main>
      <MobileBottomNav active="archives" />
    </div>
  );
}
