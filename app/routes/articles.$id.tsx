import type {
  ActionArgs,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { and, eq } from "drizzle-orm";
import {
  $object,
  $union,
  $numberString,
  type Validator,
  $string,
  $undefined,
} from "lizod";
import { getAuthenticator } from "~/auth.server";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
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

export async function action({ request, context, params }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const $empty: Validator<""> = (input: any): input is "" => input === "";
    const validate = $object({
      already_read: $union([$numberString, $empty, $undefined]),
      rating: $union([$numberString, $empty]),
      comment: $string,
    });
    const body = Object.fromEntries(await request.formData());
    console.log(body);
    if (validate(body)) {
      const id = Number(params["id"]);
      const { already_read, rating, comment } = body;
      const drizzle = getDb(context);
      await drizzle
        .update(articles)
        .set({
          already_read: already_read ? Number(body.already_read) : null,
          rating: rating === "" ? null : Number(body.rating),
          comment,
        })
        .where(eq(articles.id, id))
        .run();
      return null;
    } else {
      throw new Response(null, { status: 400 });
    }
  }

  throw new Response(null, { status: 403 });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    const { article } = data;
    const title = article.title.length > 0 ? article.title : article.content;
    return [{ title: `${title} | 読んだページ記録くん Edge` }];
  } else {
    return [];
  }
};

function renderUrl(maybeUrl: string) {
  try {
    new URL(maybeUrl);
    return (
      <a
        href={maybeUrl}
        className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
      >
        {maybeUrl}
      </a>
    );
  } catch (e) {
    return <>{maybeUrl}</>;
  }
}

export default function Article() {
  const { article } = useLoaderData<typeof loader>();
  const title = article.title.length > 0 ? article.title : article.content;
  const content = renderUrl(article.content);
  return (
    <Form
      method="post"
      className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 break-words p-4 leading-none"
    >
      <header>
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <p className="text-md leading-6">{content}</p>
      <RadioGroup
        className="grid-cols-2"
        orientation="horizontal"
        name="already_read"
        defaultValue={article.already_read?.toString() ?? ""}
      >
        <div className="flex flex-row items-center space-x-2">
          <RadioGroupItem id="read" value="1" className="h-6 w-6" />
          <Label htmlFor="read" className="text-md">
            読んだ
          </Label>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <RadioGroupItem id="unread" value="0" className="h-6 w-6" />
          <Label htmlFor="unread" className="text-md">
            読んでない
          </Label>
        </div>
      </RadioGroup>
      <Select name="rating" defaultValue={article.rating?.toString() ?? ""}>
        <SelectTrigger className="text-md">
          <SelectValue placeholder="評価する" className="text-md" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="hidden" />
          <SelectItem value="1" className="text-md">
            1
          </SelectItem>
          <SelectItem value="2" className="text-md">
            2
          </SelectItem>
          <SelectItem value="3" className="text-md">
            3
          </SelectItem>
          <SelectItem value="4" className="text-md">
            4
          </SelectItem>
          <SelectItem value="5" className="text-md">
            5
          </SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor="comment" className="-mb-2 text-lg font-semibold">
        まとめ・感想
      </Label>
      <Textarea
        id="comment"
        name="comment"
        defaultValue={article.comment}
        className="flex-grow"
      />

      <div className="mt-auto flex h-12 flex-row items-center justify-between">
        <Link
          to="/"
          className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
        >
          トップに戻る
        </Link>
        <Button size="lg" className="font-semibold">
          更新
        </Button>
      </div>
    </Form>
  );
}
