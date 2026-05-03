"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

export async function createIdea(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const title = formData.get("title")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || "General";
    const priority = formData.get("priority")?.toString() || "medium";
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const notes = formData.get("notes")?.toString() || "";
    const tags = formData.get("tags")?.toString() || "";

    if (!title) {
      return { success: false, error: "Title is required" };
    }

    // ИСПОЛЬЗУЕМ ЧИСТЫЙ SQL
    // Это гарантирует, что драйвер не добавит ничего лишнего
    await db.execute(sql`
      INSERT INTO ideas (user_id, title, category, priority, rating, notes, tags)
      VALUES (${userId}, ${title}, ${category}, ${priority}, ${rating}, ${notes}, ${tags})
    `);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    console.error("🔥 Raw SQL Error:", message);
    return { success: false, error: message };
  }
}
