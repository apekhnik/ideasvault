import { Lightbulb } from "lucide-react";

export default function EmptyVaultState() {
  return (
    <section className="grow flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 py-20">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-primary blur-[60px] animate-pulse-glow rounded-full"></div>
        <div className="bg-surface-container border border-primary/20 p-8 rounded-full relative z-10 shadow-[0_0_40px_rgba(201,168,76,0.05)]">
          <Lightbulb className="w-16 h-16 text-primary stroke-[1.5px]" />
        </div>
      </div>
      <h2 className="text-3xl font-light tracking-tight text-on-surface mb-2">
        Your Idea Sanctuary Awaits
      </h2>
      <p className="text-on-surface-variant mb-8 max-w-md">
        Begin your collection by capturing your first spark of inspiration. The vault is currently empty, awaiting your brilliance.
      </p>
      <SignedOutInPlaceholder />
    </section>
  );
}

function SignedOutInPlaceholder() {
  return (
    <div className="text-sm text-outline">
      Sign in to start capturing your ideas.
    </div>
  );
}
