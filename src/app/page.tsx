import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";
import { Filter, SortAsc, Lightbulb } from "lucide-react";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema/ideas";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { userId } = await auth();
  
  type Idea = typeof ideas.$inferSelect;
  let userIdeas: Idea[] = [];
  try {
    if (userId) {
      userIdeas = await db.select().from(ideas).where(eq(ideas.userId, userId)).orderBy(desc(ideas.createdAt));
    }
  } catch (dbError) {
    console.error("❌ Database query failed:", dbError);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-16 py-12 md:py-16">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-light tracking-tight text-on-surface">My Vault</h1>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high transition-colors text-sm">
              <SortAsc className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>

        {userIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userIdeas.map((idea) => (
              <IdeaCard 
                key={idea.id} 
                title={idea.title}
                category={idea.category}
                priority={idea.priority as 'low' | 'medium' | 'high'}
                rating={idea.rating || 0}
                notes={idea.notes || ""}
                date={new Date(idea.createdAt ?? new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <section className="flex-grow flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 py-20">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-primary blur-[60px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>
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
        )}
      </main>
    </div>
  );
}

function SignedOutInPlaceholder() {
  return (
    <div className="text-sm text-outline">
      Sign in to start capturing your ideas.
    </div>
  );
}
