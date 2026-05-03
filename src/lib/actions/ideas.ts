"use server";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema/ideas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createIdea(formData: FormData) {
  try {
    const { userId } = await auth();
    console.log("🛠️ Attempting to create idea for user:", userId);

    if (!userId) {
      console.error("❌ Unauthorized: No userId found");
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const priority = formData.get("priority") as string;
    const rating = parseInt(formData.get("rating") as string) || 0;
    const notes = formData.get("notes") as string;
    const tags = formData.get("tags") as string || "";

    console.log("📝 Form Data:", { title, category, priority, rating, notes, tags });

    if (!title || !category || !priority) {
      console.error("❌ Missing required fields");
      throw new Error("Missing required fields");
    }

    const result = await db.insert(ideas).values({
      userId,
      title,
      category,
      priority,
      rating,
      notes,
      tags,
    }).returning();

    console.log("✅ Idea created successfully:", result);

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("🔥 Error in createIdea:", error.message, error);
    // Пробрасываем ошибку дальше, чтобы увидеть её в логах Vercel
    throw new Error(error.message || "Failed to create idea");
  }
}
