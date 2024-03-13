import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import * as schema from './schemas'


const sqlite = new Database('db.sqlite');

export const db = drizzle(sqlite, { schema });

export type Database = typeof db;

export const adapter = new DrizzleSQLiteAdapter(db, schema.session, schema.users);