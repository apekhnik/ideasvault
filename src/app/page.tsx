import HomePageClient from "@/components/HomePageClient";
import { auth } from "@clerk/nextjs/server";
import { toIdeaCardProps } from "@/lib/presenters/ideas";
import { getUserIdeas } from "@/lib/queries/ideas";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { userId } = await auth();
  const userIdeas = await getUserIdeas(userId);
  const initialIdeas = userIdeas.map(toIdeaCardProps);

  return <HomePageClient initialIdeas={initialIdeas} />;
}
