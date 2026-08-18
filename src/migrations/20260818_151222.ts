import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "observe_moon_events" ALTER COLUMN "event_date" DROP DEFAULT;
  ALTER TABLE "observe_moon_events" ALTER COLUMN "event_date" TYPE timestamp(3) with time zone USING NULL;
  ALTER TABLE "observe_moon_events" ALTER COLUMN "event_time" DROP DEFAULT;
  ALTER TABLE "observe_moon_events" ADD COLUMN IF NOT EXISTS "start_time" timestamp(3) with time zone;
  ALTER TABLE "observe_moon_events" ADD COLUMN IF NOT EXISTS "end_time" timestamp(3) with time zone;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "observe_moon_events" ALTER COLUMN "event_date" TYPE varchar;
  ALTER TABLE "observe_moon_events" DROP COLUMN IF EXISTS "start_time";
  ALTER TABLE "observe_moon_events" DROP COLUMN IF EXISTS "end_time";`);
}
