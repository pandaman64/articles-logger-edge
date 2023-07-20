import type { AppLoadContext } from "@remix-run/cloudflare";

export type Env = {
  DB: D1Database;
};

export function getEnv(context: AppLoadContext): Env {
  return context.env as Env;
}
