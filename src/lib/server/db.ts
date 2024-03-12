import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);

const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
     username: text('username').notNull().unique(),
     hashed_password: text('hashed_password').notNull(),
});

const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
});

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);