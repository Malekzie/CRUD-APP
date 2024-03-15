import { relations, sql, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId } from "lucia";

// Tables

const timestamps = {
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	username: text("username").notNull().unique(),
	hashed_password: text("hashed_password").notNull(),
	...timestamps,
});

export const session = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: integer("expires_at").notNull(),
});

export const posts = sqliteTable("posts", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId(15)),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	title: text("title").notNull(),
	content: text("content").notNull(),
	...timestamps,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const postRelations = relations(posts, ({ one }) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id],
	}),
}));

// Types
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;

export type UsersWithPosts = User & {
	posts: Post[];
};

export type PostWithUser = Post & {
	user: Pick<User, "username">;
};
