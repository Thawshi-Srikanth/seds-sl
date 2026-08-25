import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "observe_moon_events" ADD COLUMN "feedback_url" varchar;
  ALTER TABLE "observe_moon_events" ADD COLUMN "is_feedback_active" boolean DEFAULT true;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "observe_moon_events" DROP COLUMN "feedback_url";
  ALTER TABLE "observe_moon_events" DROP COLUMN "is_feedback_active";`);
}
