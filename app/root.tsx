import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useParams,
  useRouteError,
} from '@remix-run/react';

import './tailwind.css';
import { AppBackground } from './components/Layout/AppBackground';
import { withSupabaseSsr } from './supabase/ssrSupabase';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { getDbClient } from './db/client';
import { offices, officeUsers, profiles } from './db/schema';
import { eq, isNull } from 'drizzle-orm';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Button } from './components/ui/button';
import { tryGetSsrUser } from './supabase/ssrUser';
import { nullPropsToUndefined } from './lib/utils';
import { AppNavbar } from './features/nav/AppNavbar';
import { Toaster } from 'react-hot-toast';
import { Profile } from './features/profile/api';

export const meta: MetaFunction = () => [
  {
    title: 'Office days',
  },
];

export async function loader(ctx: LoaderFunctionArgs) {
  return await withSupabaseSsr(ctx, async ({ supabase }) => {
    const user = await tryGetSsrUser(supabase);

    if (!user) {
      return json(null);
    }

    const db = getDbClient(ctx.context);

    const [profile, userOffices] = await Promise.all([
      db
        .select({
          firstName: profiles.firstName,
          lastName: profiles.lastName,
          avatarUrl: profiles.avatarUrl,
        })
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1)
        .then<Profile>(([p]) => (p ? nullPropsToUndefined(p) : {})),
      db
        .select({
          id: offices.id,
          displayName: offices.displayName,
        })
        .from(offices)
        .innerJoin(officeUsers, eq(officeUsers.userId, user.id))
        .where(isNull(offices.deletedOn))
        .groupBy(offices.id, offices.displayName)
        .execute(),
    ]);

    return json({
      user,
      profile,
      offices: userOffices,
    });
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  const getErrorElement = () => {
    if (isRouteErrorResponse(error)) {
      return (
        <>
          <CardHeader>
            <CardTitle className="text-4xl">
              {error.status} {error.statusText}
            </CardTitle>
          </CardHeader>
          <CardContent>{error.data}</CardContent>
        </>
      );
    } else if (error instanceof Error) {
      return (
        <>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
          </CardContent>
        </>
      );
    } else {
      return (
        <CardHeader>
          <CardTitle className="text-4xl">Unknown Error</CardTitle>
        </CardHeader>
      );
    }
  };

  return (
    <AppBackground className="min-h-screen">
      <div className="mx-auto">
        <Card className="max-w-screen-md my-4 p-4">
          {getErrorElement()}
          <CardFooter>
            <Button asChild>
              <Link to="/">Go back home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppBackground>
  );
}

export default function App() {
  const params = useParams<{ officeId?: string }>();
  const data = useLoaderData<typeof loader>();

  return (
    <div className="grid min-h-screen grid-rows-[auto,_minmax(0,_1fr)]">
      <AppNavbar
        offices={data?.offices ?? []}
        profile={data?.profile}
        user={data?.user}
      />
      <AppBackground colorsSeed={params.officeId}>
        <Outlet />
      </AppBackground>
    </div>
  );
}
