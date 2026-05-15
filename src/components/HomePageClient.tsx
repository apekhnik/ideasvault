"use client";

import { useState } from "react";
import { Grid2x2, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import IdeaListRow from "@/components/IdeaListRow";
import EmptyVaultState from "@/components/EmptyVaultState";
import MobileBottomNav from "@/components/MobileBottomNav";
import VaultToolbar from "@/components/VaultToolbar";
import { type IdeaCardData } from "@/lib/types/idea";

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

const toolbarVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: -10 },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function HomePageClient({ initialIdeas }: { initialIdeas: IdeaCardData[] }) {
  const [viewMode, setViewMode] = useState<HomeViewMode>("grid");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={toolbarVariants}
          style={{ willChange: "filter, opacity" }}
        >
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
        </motion.div>

        {initialIdeas.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}
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
