import {
  type AppLoadContext,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";
import { getEnv } from "./env.server";

export function createSessionStorage(context: AppLoadContext) {
  const env = getEnv(context);
  return createWorkersKVSessionStorage({
    cookie: {
      name: "__session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [env.SESSION_COOKIE_SECRET],
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 400, // 400 days
    },
    kv: env.SESSIONS,
  });
}
