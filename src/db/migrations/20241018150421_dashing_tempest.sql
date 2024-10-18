CREATE TABLE IF NOT EXISTS "office_user_attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"office_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"arrive_at" timestamp NOT NULL,
	"leave_at" timestamp NOT NULL,
	"notes" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "office_user_attendance" ADD CONSTRAINT "office_user_attendance_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "office_user_attendance" ADD CONSTRAINT "office_user_attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
