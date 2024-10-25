# Welcome to Office Days!

Sync up with your team by seeing when which days colleagues are in.

Check us out at [https://office-days.com](https://office-days.com)

## Development

You'll need to create a `.dev.vars` file with the following secrets populated first:

```sh
# .dev.vars
DRIZZLE_KIT_CONNECTION_STRING=EXAMPLE_VALUE
SUPABASE_SERVICE_KEY=EXAMPLE_VALUE
```

Then a `.env` file with the following secrets populated:

```sh
# .env
WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_DB=EXAMPLE_VALUE
```

Next, run the dev server:

```sh
npm run dev
```

### Technologies

This project uses the following technologies:

- [Remix](https://remix.run/)
- [Supabase](https://supabase.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## Testing

Run the tests affected by your changes in watch mode:

```sh
npm run test
```

This project uses [vitest](https://vitest.dev/) with [jsdom](https://github.com/jsdom/jsdom). Simply add a file with the convention `*.test.ts` or `*.test.tsx`, and then run `npm test` to run the tests. It will run your tests in watch mode and re-execute them when you make changes.

It will only run tests affected by your changes by default. If you want to run all tests, run `npm test:all`.

Note that linting + tests are ran automatically when you commit / push accordingly. You don't need to run them manually.

## Database migrations

Make changes to the database schema by editing [./app/db/schema.ts](./app/db/schema.ts). Then run the following command to generate a migration:

```sh
npm run db generate
```

Check the generated migration in [./app/db/migrations](./app/db/migrations) and then run the following command to apply the migration:

```sh
# Note the ":" between db and migrate. Without this, the script will fail
npm run db:migrate
```

This project uses [Drizzle ORM](https://orm.drizzle.team/) with [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview), so you get all the goodies that come with Drizzle by default, including [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview).

```sh
npm run db studio
```

You can find more Drizzle Kit commands via [the docs](https://orm.drizzle.team/docs/kit-overview)

## Deployment

Simply merge to `main` and push to GitHub. The site is hosted on [Cloudflare Pages](https://pages.cloudflare.com/), and will automatically deploy
