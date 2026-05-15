import { Filter, SortAsc } from "lucide-react";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

const titleVariants = {
  hidden: { opacity: 0, filter: "blur(12px)", scale: 0.98 },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    scale: 1,
    transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number] } 
  }
};

const actionVariants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 10 },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.5 } 
  }
};

export default function VaultToolbar({ actions }: { actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <motion.h1 
        variants={titleVariants}
        initial="hidden"
        animate="show"
        className="text-3xl font-light tracking-tight text-on-surface"
        style={{ willChange: "filter, opacity" }}
      >
        My Vault
      </motion.h1>

      <motion.div 
        variants={actionVariants}
        initial="hidden"
        animate="show"
        className="flex items-center gap-3"
        style={{ willChange: "filter, opacity" }}
      >
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors text-sm"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors text-sm"
        >
          <SortAsc className="w-4 h-4" />
          Sort
        </button>
        {actions}
      </motion.div>
    </div>
  );
}
