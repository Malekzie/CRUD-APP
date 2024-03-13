import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
     username: text('username').notNull().unique(),
     hashed_password: text('hashed_password').notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull()
});

export const posts = sqliteTable("post", {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id').notNull().references(() => users.id),
	title: text('title').notNull(),
	content: text('content').notNull()
});


// Relations
export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
   }));

export const postRelations = relations(posts, ({ one }) => ({ 
	user: one(users, {
		fields: [posts.userId],
		references: [users.id]
	})
}))