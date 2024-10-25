DELETE FROM "office_user_attendance";
--> statement-breakpoint
ALTER TABLE "office_user_attendance"
ALTER COLUMN "arrive_at" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "office_user_attendance"
ALTER COLUMN "leave_at" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "office_user_attendance"
ADD COLUMN "date" date NOT NULL;