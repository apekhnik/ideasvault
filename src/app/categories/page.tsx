import CategoriesPageClient, { type CategoryCardModel } from "@/components/CategoriesPageClient";
import { getUserCategories } from "@/lib/actions/ideas";
import { auth } from "@clerk/nextjs/server";
import { getUserIdeas } from "@/lib/queries/ideas";

export const dynamic = "force-dynamic";

type Idea = Awaited<ReturnType<typeof getUserIdeas>>[number];

const CATEGORY_ORDER = ["Business", "Personal", "Projects", "Design", "Architecture", "Research", "Other"];

const CATEGORY_ICON_KEY_MAP: Record<string, string> = {
  Business: "Business",
  Personal: "Personal",
  Projects: "Projects",
  Design: "Design",
  Architecture: "Architecture",
  Research: "Research",
  Other: "Other",
};

export default async function CategoriesPage() {
  const { userId } = await auth();
  const [userIdeas, userCategories] = await Promise.all([
    getUserIdeas(userId),
    getUserCategories(),
  ]);
  const categories = buildCategoryCards(userIdeas, userCategories);

  return <CategoriesPageClient initialCategories={categories} />;
}

function buildCategoryCards(
  ideas: Idea[],
  userCategories: Array<{ id: number; title: string; description: string | null; iconKey: string | null }>
): CategoryCardModel[] {
  const grouped = new Map<string, Idea[]>();

  for (const idea of ideas) {
    const category = normalizeCategory(idea.category);
    const group = grouped.get(category);
    if (group) {
      group.push(idea);
    } else {
      grouped.set(category, [idea]);
    }
  }

  for (const category of userCategories) {
    const normalizedTitle = normalizeCategory(category.title);
    if (!grouped.has(normalizedTitle)) {
      grouped.set(normalizedTitle, []);
    }
  }

  const userCategoryMap = new Map(
    userCategories.map((category) => [
      normalizeCategory(category.title).toLowerCase(),
      category,
    ] as const)
  );

  return [...grouped.entries()]
    .sort((a, b) => {
      const leftOrder = CATEGORY_ORDER.indexOf(a[0]);
      const rightOrder = CATEGORY_ORDER.indexOf(b[0]);
      const leftSafeOrder = leftOrder === -1 ? Number.MAX_SAFE_INTEGER : leftOrder;
      const rightSafeOrder = rightOrder === -1 ? Number.MAX_SAFE_INTEGER : rightOrder;
      return leftSafeOrder - rightSafeOrder;
    })
    .map(([title, categoryIdeas]) => {
      const persistedCategory = userCategoryMap.get(title.toLowerCase());
      const newestDate = categoryIdeas[0]?.createdAt ?? null;
      return {
        id: persistedCategory?.id ?? null,
        title,
        count: categoryIdeas.length,
        lastEntryLabel: formatRelativeTime(newestDate),
        recentIdeas: categoryIdeas.slice(0, 3).map((idea) => idea.title),
        highlightIdea:
          categoryIdeas[0]?.title ||
          persistedCategory?.description ||
          "No recent notes yet.",
        iconKey: resolveCategoryIconKey(title, persistedCategory?.iconKey),
      };
    });
}

function normalizeCategory(rawCategory: string | null): string {
  if (!rawCategory) return "Other";
  const value = rawCategory.trim();
  if (!value) return "Other";
  return value;
}

function resolveCategoryIconKey(
  title: string,
  persistedIconKey: string | null | undefined
): string {
  if (persistedIconKey && persistedIconKey.trim()) {
    return persistedIconKey.trim();
  }

  return CATEGORY_ICON_KEY_MAP[title] || "Other";
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return "Unknown";

  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  return rtf.format(diffMonths, "month");
}
