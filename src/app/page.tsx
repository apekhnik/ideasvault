import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import EmptyVaultState from "@/components/EmptyVaultState";
import MobileBottomNav from "@/components/MobileBottomNav";
import VaultToolbar from "@/components/VaultToolbar";
import { auth } from "@clerk/nextjs/server";
import { toIdeaCardProps } from "@/lib/presenters/ideas";
import { getUserIdeas } from "@/lib/queries/ideas";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { userId } = await auth();
  const userIdeas = await getUserIdeas(userId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16 pb-24 md:pb-16">
        <VaultToolbar />

        {userIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...toIdeaCardProps(idea)} />
            ))}
          </div>
        ) : (
          <EmptyVaultState />
        )}
      </main>
      <MobileBottomNav active="vault" />
    </div>
  );
}
