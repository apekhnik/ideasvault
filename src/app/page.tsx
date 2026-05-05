import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary mb-6 uppercase">
        Welcome to IdeaVault
      </h1>
      <p className="text-on-surface-variant max-w-2xl mb-10 text-lg">
        The ultimate sanctuary for your most precious thoughts and creative sparks. 
        Secure, organized, and always at your fingertips.
      </p>
      <Link 
        href="/vault"
        className="gold-gradient text-surface px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
      >
        Enter the Vault
      </Link>
    </div>
  );
}
