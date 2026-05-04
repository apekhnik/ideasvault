import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull(),
  rating: integer("rating"),
  notes: text("notes"),
  tags: text("tags"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    iconKey: text("icon_key"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    userTitleIdx: uniqueIndex("categories_user_id_title_idx").on(
      table.userId,
      table.title
    ),
  })
);
