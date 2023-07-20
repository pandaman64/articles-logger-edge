import type { AppLoadContext } from "@remix-run/cloudflare";

export type Env = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  SESSION_COOKIE_SECRET: string;
  DB: D1Database;
  SESSIONS: KVNamespace;
};

export function getEnv(context: AppLoadContext): Env {
  return context.env as Env;
}
