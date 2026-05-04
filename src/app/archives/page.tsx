import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import { auth } from "@clerk/nextjs/server";
import { toIdeaCardProps } from "@/lib/presenters/ideas";
import { getUserArchivedIdeas } from "@/lib/queries/ideas";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  const { userId } = await auth();
  const archivedIdeas = await getUserArchivedIdeas(userId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-on-surface">
            Archives
          </h1>
          <p className="text-sm text-outline mt-1">
            Stored ideas moved out of your active vault.
          </p>
        </header>

        {archivedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                {...toIdeaCardProps(idea)}
                showArchiveButton={false}
              />
            ))}
          </div>
        ) : (
          <section className="bg-surface border border-outline-variant/40 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-light text-on-surface mb-2">
              Archive is Empty
            </h2>
            <p className="text-outline">
              Archive ideas from your vault to keep it focused.
            </p>
          </section>
        )}
      </main>
      <MobileBottomNav active="archives" />
    </div>
  );
}
