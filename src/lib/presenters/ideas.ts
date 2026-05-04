import { type IdeaRecord } from "@/lib/queries/ideas";
import { type IdeaCardData, type IdeaPriority } from "@/lib/types/idea";
import { IdeaPriority as IdeaPriorityEnum } from "@/lib/types/idea";

export function toIdeaCardProps(idea: IdeaRecord): IdeaCardData {
  return {
    id: idea.id,
    title: idea.title,
    category: idea.category,
    priority: normalizePriority(idea.priority),
    rating: idea.rating || 0,
    notes: idea.notes || "",
    date: formatIdeaDate(idea.createdAt),
  };
}

function normalizePriority(priority: string): IdeaPriority {
  if (
    priority === IdeaPriorityEnum.Low ||
    priority === IdeaPriorityEnum.Medium ||
    priority === IdeaPriorityEnum.High
  ) {
    return priority;
  }
  return IdeaPriorityEnum.Medium;
}

function formatIdeaDate(date: Date | null): string {
  return new Date(date ?? new Date()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
