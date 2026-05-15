"use client";

import { useState } from "react";
import { Grid2x2, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import IdeaListRow from "@/components/IdeaListRow";
import EmptyVaultState from "@/components/EmptyVaultState";
import MobileBottomNav from "@/components/MobileBottomNav";
import { type IdeaCardData } from "@/lib/types/idea";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type HomeViewMode = "grid" | "list";

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
    y: 20,
  },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: -10 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomePageClient({ initialIdeas }: { initialIdeas: IdeaCardData[] }) {
  const [viewMode, setViewMode] = useState<HomeViewMode>("grid");

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
              <span className="w-12 h-[1px] bg-primary" />
              <span className="font-label-meta text-xs text-primary uppercase tracking-[0.2em]">Personal Knowledge Base</span>
            </div>
            <h1 className="font-page-title text-4xl md:text-5xl text-on-surface mb-4">My Vault</h1>
            <p className="font-body text-lg text-secondary max-w-lg">
              A living repository of ideas, observations, and concepts — captured before they slip away.
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

        {initialIdeas.length > 0 ? (
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
                  <span className="font-label-meta text-[10px] md:text-xs text-outline uppercase tracking-wider">Added</span>
                </div>
              </div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
                  : "divide-y divide-outline-variant/20"
              )}
            >
              <AnimatePresence mode="popLayout">
                {initialIdeas.map((idea) => (
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
                      <IdeaCard {...idea} />
                    ) : (
                      <IdeaListRow {...idea} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
          >
            <EmptyVaultState />
          </motion.div>
        )}
      </main>

      <MobileBottomNav active="vault" />
    </div>
  );
}
