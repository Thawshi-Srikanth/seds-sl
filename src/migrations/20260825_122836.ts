import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_observe_moon_events_status" ADD VALUE 'unpublished';`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "observe_moon_events" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "observe_moon_events" ALTER COLUMN "status" SET DEFAULT 'published'::text;
  DROP TYPE "public"."enum_observe_moon_events_status";
  CREATE TYPE "public"."enum_observe_moon_events_status" AS ENUM('published', 'draft');
  ALTER TABLE "observe_moon_events" ALTER COLUMN "status" SET DEFAULT 'published'::"public"."enum_observe_moon_events_status";
  ALTER TABLE "observe_moon_events" ALTER COLUMN "status" SET DATA TYPE "public"."enum_observe_moon_events_status" USING "status"::"public"."enum_observe_moon_events_status";`);
}
