import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema/ideas";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";

export type IdeaRecord = typeof ideas.$inferSelect;

export async function getUserIdeas(userId: string | null): Promise<IdeaRecord[]> {
  if (!userId) return [];

  try {
    return await db
      .select()
      .from(ideas)
      .where(and(eq(ideas.userId, userId), isNull(ideas.archivedAt)))
      .orderBy(desc(ideas.createdAt));
  } catch (dbError) {
    console.error("❌ Database query failed:", dbError);
    return [];
  }
}

export async function getUserArchivedIdeas(userId: string | null): Promise<IdeaRecord[]> {
  if (!userId) return [];

  try {
    return await db
      .select()
      .from(ideas)
      .where(and(eq(ideas.userId, userId), isNotNull(ideas.archivedAt)))
      .orderBy(desc(ideas.archivedAt));
  } catch (dbError) {
    console.error("❌ Archived ideas query failed:", dbError);
    return [];
  }
}
