import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull(),
  rating: integer("rating"),
  notes: text("notes"),
  tags: text("tags"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
