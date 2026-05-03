import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: text("title").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  priority: varchar("priority", { length: 20 }).notNull(), // low, medium, high
  rating: integer("rating").default(0),
  notes: text("notes"),
  tags: text("tags"), // JSON string or comma-separated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
