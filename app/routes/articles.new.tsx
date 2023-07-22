import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/auth.server";
import { $object, $string } from "lizod";
import { getDb } from "~/db.server";
import { articles } from "~/schema.server";

export async function action({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const validate = $object({
      title: $string,
      content: $string,
      url: $string,
    });
    const body = Object.fromEntries(await request.formData());
    if (validate(body)) {
      const { title, content, url } = body;
      const drizzle = getDb(context);
      const { id } = await drizzle
        .insert(articles)
        .values({
          title,
          content,
          url,
          userId: user.id,
        })
        .returning({ id: articles.id })
        .get();
      return redirect(`/articles/${id}`);
    } else {
      throw new Response(null, { status: 400 });
    }
  }

  throw new Response(null, { status: 403 });
}
