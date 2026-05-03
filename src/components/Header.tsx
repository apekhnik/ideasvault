"use client";
import { UserButton, useAuth, SignInButton } from "@clerk/nextjs";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AddIdeaModal from "./AddIdeaModal";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <>
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] top-0 z-50 sticky tracking-tight font-light">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-16 h-20">
          <div className="text-xl font-bold tracking-tighter text-primary uppercase">
            IdeaVault
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-primary border-b border-primary pb-1 active:scale-95 duration-200 ease-out">
              Vault
            </Link>
            <Link href="/categories" className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-out">
              Categories
            </Link>
            <Link href="/archives" className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-out">
              Archives
            </Link>
            <Link href="/settings" className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-out">
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors w-48 placeholder-outline" 
                placeholder="Search ideas..." 
                type="text"
              />
            </div>
            
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="gold-gradient text-surface px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95 duration-200 ease-out flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">New Idea</span>
                </button>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border border-primary/20" } }} />
              </div>
            )}
            
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="gold-gradient text-surface px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95 duration-200 ease-out">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>
      <AddIdeaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
