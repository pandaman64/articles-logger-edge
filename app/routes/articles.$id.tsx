import type { LoaderArgs} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { and, eq } from "drizzle-orm";
import { getAuthenticator } from "~/auth.server";
import { getDb } from "~/db.server";
import { articles, type Article } from "~/schema.server";

export async function loader({ request, context, params }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const drizzle = getDb(context);
    const article: Article | undefined = await drizzle
      .select()
      .from(articles)
      .where(
        and(eq(articles.id, Number(params["id"])), eq(articles.userId, user.id))
      )
      .get();
    if (article) {
      return json({ article });
    }
  }

  throw new Response(null, { status: 404 });
}

export default function Article() {
  const { article } = useLoaderData<typeof loader>();
  return (
    <>
      {article?.title},{article?.content},{article?.url},
    </>
  );
}
