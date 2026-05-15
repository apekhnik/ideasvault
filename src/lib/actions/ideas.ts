"use server";
import { db } from "@/lib/db";
import { categories, ideas } from "@/lib/db/schema/ideas";
import { DEFAULT_CATEGORY, IdeaPriority } from "@/lib/types/idea";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sql, eq, and } from "drizzle-orm";

export async function createIdea(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const title = formData.get("title")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || DEFAULT_CATEGORY;
    const priority = formData.get("priority")?.toString() || IdeaPriority.Medium;
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const notes = formData.get("notes")?.toString() || "";
    const tags = formData.get("tags")?.toString() || "";

    if (!title) {
      return { success: false, error: "Title is required" };
    }

    await db.insert(ideas).values({
      userId,
      title,
      category,
      priority,
      rating,
      notes,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    console.error("🔥 Create Error:", message);
    return { success: false, error: message };
  }
}

export async function deleteIdea(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.delete(ideas).where(
      and(
        eq(ideas.id, id),
        eq(ideas.userId, userId)
      )
    );

    revalidatePath("/");
    revalidatePath("/archives");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("🔥 Delete Error:", error);
    return { success: false };
  }
}

export async function updateIdea(id: number, formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const title = formData.get("title")?.toString().trim() || "";
    const category = formData.get("category")?.toString() || DEFAULT_CATEGORY;
    const priority = formData.get("priority")?.toString() || IdeaPriority.Medium;
    const rating = parseInt(formData.get("rating")?.toString() || "0");
    const notes = formData.get("notes")?.toString() || "";
    const tags = formData.get("tags")?.toString() || "";

    if (!title) {
      return { success: false, error: "Title is required" };
    }

    await db
      .update(ideas)
      .set({
        title,
        category,
        priority,
        rating,
        notes,
        tags,
        updatedAt: new Date(),
      })
      .where(and(eq(ideas.id, id), eq(ideas.userId, userId)));

    revalidatePath("/");
    revalidatePath("/archives");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    console.error("🔥 Update Error:", message);
    return { success: false, error: message };
  }
}

export async function getIdeaCategories() {
  try {
    const { userId } = await auth();
    if (!userId) return [DEFAULT_CATEGORY];

    const ideaCategoryRows = await db.execute(sql`
      SELECT DISTINCT category
      FROM ideas
      WHERE user_id = ${userId}
        AND category IS NOT NULL
        AND category <> ''
      ORDER BY category ASC
    `);

    const ideaCategories = (Array.isArray(ideaCategoryRows)
      ? ideaCategoryRows
      : (ideaCategoryRows as { rows?: Array<{ category?: string | null }> }).rows ?? []
    )
      .map((row) => (row.category ?? "").trim())
      .filter(Boolean);

    const userCategories = await db
      .select({ title: categories.title })
      .from(categories)
      .where(eq(categories.userId, userId));

    const categoryTableTitles = userCategories
      .map((row) => row.title.trim())
      .filter(Boolean);

    const withDefault = [
      DEFAULT_CATEGORY,
      ...categoryTableTitles,
      ...ideaCategories,
    ];
    return [...new Set(withDefault)];
  } catch (error) {
    console.error("🔥 Categories Read Error:", error);
    return [DEFAULT_CATEGORY];
  }
}

export async function getUserCategories() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    return await db
      .select({
        title: categories.title,
        description: categories.description,
        iconKey: categories.iconKey,
      })
      .from(categories)
      .where(eq(categories.userId, userId));
  } catch (error) {
    console.error("🔥 User Categories Read Error:", error);
    return [];
  }
}

export async function createCategory(input: {
  title: string;
  description?: string;
  iconKey?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const title = input.title?.trim() || "";
    const description = input.description?.trim() || "";
    const iconKey = input.iconKey?.trim() || "inventory";

    if (!title) {
      return { success: false, error: "Category title is required" };
    }

    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.userId, userId), eq(categories.title, title)));

    if (existing.length > 0) {
      return { success: false, error: "Category already exists" };
    }

    await db.insert(categories).values({
      userId,
      title,
      description,
      iconKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/categories");
    return {
      success: true,
      category: { title, description, iconKey },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    console.error("🔥 Create Category Error:", message);
    return { success: false, error: message };
  }
}

export async function archiveIdea(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db
      .update(ideas)
      .set({
        archivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(ideas.id, id), eq(ideas.userId, userId)));

    revalidatePath("/");
    revalidatePath("/archives");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("🔥 Archive Error:", error);
    return { success: false };
  }
}
