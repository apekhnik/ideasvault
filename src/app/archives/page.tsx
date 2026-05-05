import ArchivesPageClient from "@/components/ArchivesPageClient";
import { auth } from "@clerk/nextjs/server";
import { toIdeaCardProps } from "@/lib/presenters/ideas";
import { getUserArchivedIdeas } from "@/lib/queries/ideas";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  const { userId } = await auth();
  const archivedIdeas = await getUserArchivedIdeas(userId);
  const initialIdeas = archivedIdeas.map(toIdeaCardProps);

  return <ArchivesPageClient initialIdeas={initialIdeas} />;
}
