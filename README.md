# Welcome to Office Days!

Sync up with your team by seeing when which days colleagues are in.

Check us out at [https://office-days.com](https://office-days.com)

## Development

Run the dev server:

```sh
npm run dev
```

This project uses the following technologies:

- [Remix](https://remix.run/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

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

This project uses [Drizzle ORM](https://orm.drizzle.team/), so you get all the goodies that come with Drizzle by default, including a PostgreSQL client that you can use to browse the database.

```sh
npm run db studio
```

## Deployment

Simply merge to `main` and push to GitHub. The site is hosted on [Cloudflare Pages](https://pages.cloudflare.com/), and will automatically deploy
