import { type MetaFunction } from '@remix-run/cloudflare';
import { Link, useRouteLoaderData } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import { getTitle } from '~/components/getTitle';
import { AppBackground } from '~/components/Layout/AppBackground';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { loader as rootLoader } from '~/root';

export const meta: MetaFunction = (ctx) => {
  return [
    { title: getTitle(ctx) },
    {
      name: 'description',
      content:
        'Sync up with your team by seeing when which days colleagues are in',
    },
  ];
};

export default function Index() {
  const data = useRouteLoaderData<typeof rootLoader>('root');

  if (!data?.user) {
    return (
      <div className="mx-auto py-4 max-w-sm md:max-w-lg w-full">
        <Card>
          <CardHeader className="md:px-16 md:pt-8">
            <CardTitle className="text-4xl font-light">Office days</CardTitle>
          </CardHeader>
          <CardContent className="md:px-16">
            <p>
              Sync up with your team by seeing which days your colleagues are in
            </p>
          </CardContent>

          <CardFooter className="md:px-16 gap-2">
            <Button asChild>
              <Link to="/auth/sign-up">Sign up</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth/sign-in">Sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto py-4 px-2 max-w-screen-lg w-full">
      <ul className="flex flex-wrap gap-4 w-full">
        {data.offices.map((office) => (
          <li
            key={office.id}
            className="group list-none flex-grow overflow-hidden border-2"
          >
            <AppBackground colorsSeed={office.id}>
              <Link
                className="relative inline-block max-w-screen w-full min-w-48 overflow-hidden rounded-md"
                to={`/office/${office.id}`}
              >
                <div className="w-full h-full">
                  <div className="w-full px-6 pt-4 pb-[50%] bg-gradient-to-b from-white/90 to-transparent">
                    <div className="flex flex-row items-center justify-between space-y-0">
                      <h3 className="text-4xl font-normal">
                        {office.displayName}
                      </h3>
                      <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </AppBackground>
          </li>
        ))}
      </ul>
    </div>
  );
}
