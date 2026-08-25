import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "moon_registrations" ADD COLUMN "registration_code" varchar;
  CREATE UNIQUE INDEX "moon_registrations_registration_code_idx" ON "moon_registrations" USING btree ("registration_code");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "moon_registrations_registration_code_idx";
  ALTER TABLE "moon_registrations" DROP COLUMN "registration_code";`);
}
