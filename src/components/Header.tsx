"use client";
import { UserButton, useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import IdeaFormModal from "./IdeaFormModal";

const NAV_LINKS = [
  { href: "/", label: "Vault" },
  { href: "/categories", label: "Categories" },
  { href: "/archives", label: "Archives" },
  { href: "/settings", label: "Settings" },
] as const;

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] top-0 z-50 sticky tracking-tight font-light">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-16 h-20">
          <BrandLogo />
          <PrimaryNavigation pathname={pathname} />

          <div className="flex items-center gap-4 md:gap-6">
            <SearchField />
            
            {isLoaded && isSignedIn && (
              <SignedInActions onCreateIdea={() => setIsModalOpen(true)} />
            )}
            
            {isLoaded && !isSignedIn && (
              <SignedOutActions />
            )}
          </div>
        </div>
      </header>
      <IdeaFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function BrandLogo() {
  return (
    <Link href="/" className="text-xl font-bold tracking-tighter text-primary uppercase">
      IdeaVault
    </Link>
  );
}

function PrimaryNavigation({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            isActiveLink(pathname, link.href)
              ? "text-primary border-b border-primary pb-1 active:scale-95 duration-200 ease-out"
              : "text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-out"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function isActiveLink(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchField() {
  return (
    <div className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
      <input
        className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors w-48 placeholder-outline"
        placeholder="Search ideas..."
        type="text"
      />
    </div>
  );
}

function SignedInActions({ onCreateIdea }: { onCreateIdea: () => void }) {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <button
        onClick={onCreateIdea}
        className="gold-gradient text-surface px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95 duration-200 ease-out flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden xs:inline">New Idea</span>
      </button>
      <SignOutButton>
        <button className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors text-sm active:scale-95 duration-200 ease-out">
          Log out
        </button>
      </SignOutButton>
      <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border border-primary/20" } }} />
    </div>
  );
}

function SignedOutActions() {
  return (
    <SignInButton mode="modal">
      <button className="gold-gradient text-surface px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95 duration-200 ease-out">
        Sign In
      </button>
    </SignInButton>
  );
}
