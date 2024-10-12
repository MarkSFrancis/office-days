ALTER TABLE "organization_users" RENAME TO "office_users";--> statement-breakpoint
ALTER TABLE "organizations" RENAME TO "offices";--> statement-breakpoint
ALTER TABLE "office_users" RENAME COLUMN "organization_id" TO "office_id";--> statement-breakpoint
ALTER TABLE "office_users" DROP CONSTRAINT "organization_users_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "office_users" DROP CONSTRAINT "organization_users_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "office_users" DROP CONSTRAINT "organization_users_invited_by_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "organization_users_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "one_owner_per_organization";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "office_users" ADD CONSTRAINT "office_users_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "office_users" ADD CONSTRAINT "office_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "office_users" ADD CONSTRAINT "office_users_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE set default ON UPDATE set default;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "office_users_unique" ON "office_users" USING btree ("user_id","office_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "one_owner_per_office" ON "office_users" USING btree ("office_id") WHERE "office_users"."role" = 'OWNER';