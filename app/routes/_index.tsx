import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { getAuthenticator } from "~/auth.server";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { getDb } from "~/db.server";
import type { Article } from "~/schema.server";
import { articles } from "~/schema.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "読んだページ記録くん Edge" },
    { name: "description", content: "読んだページ記録くんを記録してくれるよ" },
  ];
};

export async function loader({ request, context }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  if (user) {
    const drizzle = getDb(context);
    const userArticles = await drizzle
      .select()
      .from(articles)
      .where(eq(articles.userId, user.id))
      .all();
    return json({ user, userArticles });
  }

  return json({ user, userArticles: [] });
}

function LoginForm() {
  return (
    <Form action="/auth/google" method="post">
      <Button className="text-md font-bold" size="lg">
        ログイン
      </Button>
    </Form>
  );
}

function LogoutForm() {
  return (
    <Form action="/auth/logout" method="post">
      <Button className="text-md font-bold" size="lg">
        ログアウト
      </Button>
    </Form>
  );
}

function ArticleCard(article: Article) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {article.title.length > 0 ? article.title : article.content}
        </CardTitle>
        <CardDescription>{article.content}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function Index() {
  const { user, userArticles } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <header className="flex flex-row p-2">
        <div className="ml-auto">{user ? <LogoutForm /> : <LoginForm />}</div>
      </header>
      <Separator />
      <main className="p-2">
        <ul className="flex flex-col gap-4">
          {userArticles.map((article) => (
            <li key={article.id}>
              <ArticleCard {...article} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
