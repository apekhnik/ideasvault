"use server";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema/ideas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createIdea(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title")?.toString() || "";
    const category = formData.get("category")?.toString() || "General";
    const priority = formData.get("priority")?.toString() || "medium";
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const notes = formData.get("notes")?.toString() || "";
    const tags = formData.get("tags")?.toString() || "";

    // Явное указание данных для вставки
    await db.insert(ideas).values({
      userId: userId,
      title: title,
      category: category,
      priority: priority,
      rating: rating,
      notes: notes,
      tags: tags,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create idea";
    console.error("🔥 DB Insert Error:", message);
    throw new Error(message);
  }
}
