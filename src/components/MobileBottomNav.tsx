"use client";

import Link from "next/link";
import { Archive, Grid2x2, ArchiveRestore, Settings } from "lucide-react";

export default function MobileBottomNav({
  active,
}: {
  active: "vault" | "categories" | "archives" | "settings";
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface border-t border-primary/20 shadow-[0_-4px_20px_rgba(201,168,76,0.08)]">
      <Link
        href="/vault"
        className={
          active === "vault"
            ? "flex flex-col items-center justify-center text-primary bg-surface-container-high rounded-xl px-4 py-1 transition-all active:scale-90"
            : "flex flex-col items-center justify-center text-outline hover:text-primary transition-all active:scale-90"
        }
      >
        <Archive className="w-4 h-4 mb-1" />
        <span className="text-[10px] font-medium tracking-widest uppercase">Vault</span>
      </Link>

      <Link
        href="/categories"
        className={
          active === "categories"
            ? "flex flex-col items-center justify-center text-primary bg-surface-container-high rounded-xl px-4 py-1 transition-all active:scale-90"
            : "flex flex-col items-center justify-center text-outline hover:text-primary transition-all active:scale-90"
        }
      >
        <Grid2x2 className="w-4 h-4 mb-1" />
        <span className="text-[10px] font-medium tracking-widest uppercase">Categories</span>
      </Link>

      <Link
        href="/archives"
        className={
          active === "archives"
            ? "flex flex-col items-center justify-center text-primary bg-surface-container-high rounded-xl px-4 py-1 transition-all active:scale-90"
            : "flex flex-col items-center justify-center text-outline hover:text-primary transition-all active:scale-90"
        }
      >
        <ArchiveRestore className="w-4 h-4 mb-1" />
        <span className="text-[10px] font-medium tracking-widest uppercase">Archive</span>
      </Link>

      <button
        className={
          active === "settings"
            ? "flex flex-col items-center justify-center text-primary bg-surface-container-high rounded-xl px-4 py-1 transition-all active:scale-90"
            : "flex flex-col items-center justify-center text-outline hover:text-primary transition-all active:scale-90"
        }
      >
        <Settings className="w-4 h-4 mb-1" />
        <span className="text-[10px] font-medium tracking-widest uppercase">Settings</span>
      </button>
    </nav>
  );
}
