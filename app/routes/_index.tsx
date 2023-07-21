import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/auth.server";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "読んだページ記録くん Edge" },
    { name: "description", content: "読んだページ記録くんを記録してくれるよ" },
  ];
};

export async function loader({ request, context }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
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

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <header className="flex flex-row p-2">
        <div className="ml-auto">{user ? <LogoutForm /> : <LoginForm />}</div>
      </header>
      <Separator />
      <main className="p-2">
        <ul className="flex flex-col gap-4">
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  哲学倫理学ブックガイド2023.pdf
                </CardTitle>
                <CardDescription>
                  https://researchmap.jp/multidatabases/multidatabase_contents/download/236027/ce7250b281bffe6cc57f9250ea67a5ac/30511?col_no=2&frame_id=819673
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  React 18とSuspenseの基本 ─ フレームワークの選択やReact Server Componentsなど新しいベストプラクティスを学ぶ
                  - エンジニアHub｜Webエンジニアのキャリアを考える！
                </CardTitle>
                <CardDescription>
                  https://eh-career.com/engineerhub/entry/2023/07/14/093000
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">A locking war story</CardTitle>
                <CardDescription>
                  https://sentry.engineering/blog/locking-war-story
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
          <li>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moral Responsibility</CardTitle>
                <CardDescription>
                  https://plato.stanford.edu/entries/moral-responsibility/
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
        </ul>
      </main>
    </div>
  );
}
