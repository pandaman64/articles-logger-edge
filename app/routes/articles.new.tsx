import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/auth.server";
import { $object, $string, $undefined, $union } from "lizod";
import { getDb } from "~/db.server";
import { articles } from "~/schema.server";

export async function action({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const validate = $object({
      title: $union([$string, $undefined]),
      text: $union([$string, $undefined]),
      url: $union([$string, $undefined]),
    });
    const body = Object.fromEntries(await request.formData());
    console.log("received body", body);
    if (validate(body)) {
      const { title, text, url } = body;
      const drizzle = getDb(context);
      const { id } = await drizzle
        .insert(articles)
        .values({
          userId: user.id,
          title: title ?? "",
          content: text ?? "",
          url: url ?? "",
        })
        .returning({ id: articles.id })
        .get();
      console.log("inserted article", id);
      return redirect(`/articles/${id}`);
    } else {
      console.log("invalid body", body);
      throw new Response(null, { status: 400 });
    }
  }

  throw new Response(null, { status: 403 });
}
