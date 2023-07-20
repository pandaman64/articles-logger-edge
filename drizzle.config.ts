import type { Config } from "drizzle-kit";

export default {
  schema: "app/schema.server.ts",
  out: "drizzle",
} satisfies Config;
