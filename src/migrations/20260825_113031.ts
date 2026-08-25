import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "observe_moon_events" ADD COLUMN "confirmation_email_subject" varchar;
  ALTER TABLE "observe_moon_events" ADD COLUMN "confirmation_email_body" varchar;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "observe_moon_events" DROP COLUMN "confirmation_email_subject";
  ALTER TABLE "observe_moon_events" DROP COLUMN "confirmation_email_body";`);
}
