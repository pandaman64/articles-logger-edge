import type { InferModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  displayName: text("display_name").notNull(),
});

export const idAssociation = sqliteTable(
  "id_association",
  {
    provider: text("provider").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    pk: primaryKey(table.provider, table.providerId),
  })
);

export const articles = sqliteTable(
  "articles",
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    insertedAt: text("inserted_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    title: text("title").notNull(),
    content: text("content").notNull(),
    url: text("url").notNull(),
    already_read: integer("already_read"),
    rating: integer("rating"),
    comment: text("comment").notNull().default(""),
  },
  (table) => ({
    uniqueArticles: uniqueIndex("unique_articles").on(
      table.userId,
      table.title,
      table.content,
      table.url
    ),
  })
);

export type Article = InferModel<typeof articles>;
