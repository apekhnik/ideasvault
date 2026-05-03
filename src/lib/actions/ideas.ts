"use server";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema/ideas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createIdea(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;
  const rating = parseInt(formData.get("rating") as string) || 0;
  const notes = formData.get("notes") as string;
  const tags = formData.get("tags") as string;

  await db.insert(ideas).values({
    userId,
    title,
    category,
    priority,
    rating,
    notes,
    tags,
  });

  revalidatePath("/");
}
