// import { integer } from "drizzle-orm/gel-core";
import { pgTable, serial, text, timestamp , integer, varchar, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  credits: integer('credits').default(3),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: serial("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectId", { length: 255 }).notNull().unique(),
  userEmail: varchar("userEmail", { length: 255 }).notNull(),
  projectName: text("projectName").notNull(),
  userId: serial("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const whiteboardData = pgTable("whiteboard_data", {
  id: serial("id").primaryKey(),
  projectId: varchar("projectId", { length: 255 }).notNull().unique().references(() => projects.projectId),
  elements: jsonb("elements"),
  appState: jsonb("appState"),
  files: jsonb("files"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
