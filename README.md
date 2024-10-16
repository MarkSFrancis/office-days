# Office Days

Track which days your teasm are in the office, so you can be in on the same day!

# Contributing

## Prerequisites

- Git
- NodeJS
- A supabase project URL
- A supabase project public key
- A supabase connection string
- A supabase secret key

## Steps

1. Clone the project onto your local machine
1. Open a shell at the root of the project and run `npm i`
1. Run `npm test` to run all unit tests
1. Set `VITE_SUPABASE_URL` in [`.env`](./.env) to the supabase project URL you got earlier
1. Set `VITE_SUPABASE_KEY` in [`.env`](./.env) to the supabase project **public** key you got earlier
1. Set `SUPABASE_DB_CONNECTION_STRING` in the same file to the supabase connection string you got earlier
1. Set `DRIZZLE_KIT_CONNECTION_STRING` in the same file to the same string, but set the port number to `5432`

   ```sh
   # .env
   VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
   VITE_SUPABASE_KEY=[YOUR_PUBLIC_KEY]
   SUPABASE_DB_CONNECTION_STRING="postgresql://[YOUR_DATABASE_USER]:[YOUR_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   DRIZZLE_KIT_CONNECTION_STRING="postgresql://[YOUR_DATABASE_USER]:[YOUR_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

1. Run `npm run dev` to run on your local machine

## Deploy

1. Push to any branch other than `main` to create and deploy to a preview environment
1. Push to `main` or merge into `origin/main` to deploy to production

# Database tools

This application uses Supbase, which is a PostgreSQL database provider with a series of additional features on top. One of the typical features is the Data API, which we use for realtime syncing

## Exploring the database

Run `npm run db studio` to open [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) in your browser

## Changing the database schema

1. Make any necessary changes to [./functions/db/schema.ts](./functions/db/schema.ts)
1. Run `npm run db generate`
1. Run `npm run db:migrate`. Note the column between `db` and `migrate`! Without this, Drizzle will silently fail to migrate
1. Run `npm run db:supabase-types` to update the Supabase typescript definitions

You can also use `npm run db push` to quickly push your schema up to a database. This is useful for prototyping quickly, but you should use migrations once you're happy with the changes.

## Troubleshooting

Sometimes the workers runtime hard-crashes and fails to shutdown properly. When that happens, run the following two commands:

```sh
sudo lsof -i :8787
sudo kill PID # Replace PID with the process ID output from the above command
```

# Invitation flow

1. User signs up
1. When they sign up, they're asked to create an office
   1. They can create an office
   1. They can join an existing office
      1. They're asked for the office link, which they can get from the person who created the office
1. User can invite other users to an office they're in via a link
   1. If the user who clicks the link isn't signed in
      1. They're asked to sign up / sign in
   1. The link will add the user to the office without needing to accept an invitation
