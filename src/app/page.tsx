"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(12px)",
    scale: 0.98
  },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    scale: 1,
    transition: { 
      duration: 1.5, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    } 
  },
};

const subtitleContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(12px)", 
    y: 10 
  },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { 
      duration: 1.4, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
};

const buttonVariants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(8px)", 
    y: 15 
  },
  show: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0,
    transition: { 
      duration: 1.2, 
      delay: 1.0,
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
        style={{ willChange: "transform, opacity" }}
      >
        <motion.h1 
          variants={titleVariants}
          className="text-4xl md:text-7xl font-bold tracking-tighter text-primary mb-6 uppercase"
          style={{ willChange: "filter, opacity", transform: "translateZ(0)" }}
        >
          Welcome to IdeaVault
        </motion.h1>

        <motion.div 
          variants={subtitleContainerVariants}
          className="flex flex-col items-center mb-10"
        >
          <motion.p 
            variants={itemVariants}
            className="text-on-surface-variant max-w-2xl text-lg md:text-xl font-light"
            style={{ willChange: "filter, opacity", transform: "translateZ(0)" }}
          >
            The ultimate sanctuary for your most precious thoughts and creative sparks.
          </motion.p>
          <motion.p 
            variants={itemVariants}
            className="text-on-surface-variant max-w-2xl text-lg md:text-xl font-light mt-2"
            style={{ willChange: "filter, opacity", transform: "translateZ(0)" }}
          >
            Secure, organized, and always at your fingertips.
          </motion.p>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          style={{ willChange: "filter, opacity, transform", transform: "translateZ(0)" }}
        >
          <Link 
            href="/vault"
            className="gold-gradient text-surface px-10 py-5 rounded-xl font-bold text-xl hover:opacity-90 transition-all active:scale-95 shadow-[0_0_30px_rgba(201,168,76,0.3)] inline-block"
          >
            Enter the Vault
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
