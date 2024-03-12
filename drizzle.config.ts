import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/server/db.ts",
  out: "./drizzle",
} satisfies Config;