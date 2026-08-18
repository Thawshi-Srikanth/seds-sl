import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_moon_registrations_payment_status" AS ENUM('n/a', 'pending', 'verified', 'rejected');
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DEFAULT 'confirmed'::text;
  DROP TYPE "public"."enum_moon_registrations_status";
  CREATE TYPE "public"."enum_moon_registrations_status" AS ENUM('confirmed', 'pending', 'cancelled');
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DEFAULT 'confirmed'::"public"."enum_moon_registrations_status";
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DATA TYPE "public"."enum_moon_registrations_status" USING "status"::"public"."enum_moon_registrations_status";
  ALTER TABLE "observe_moon_events" ALTER COLUMN "location" SET DEFAULT 'Galle Face Green, Colombo';
  ALTER TABLE "moon_registrations" ADD COLUMN "selected_location" varchar;
  ALTER TABLE "moon_registrations" ADD COLUMN "payment_slip_id" integer;
  ALTER TABLE "moon_registrations" ADD COLUMN "payment_status" "enum_moon_registrations_payment_status" DEFAULT 'n/a';
  ALTER TABLE "observe_moon_events" ADD COLUMN "is_paid" boolean DEFAULT false;
  ALTER TABLE "observe_moon_events" ADD COLUMN "ticket_price" varchar;
  ALTER TABLE "observe_moon_events" ADD COLUMN "payment_details" varchar;
  ALTER TABLE "moon_registrations" ADD CONSTRAINT "moon_registrations_payment_slip_id_media_id_fk" FOREIGN KEY ("payment_slip_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "moon_registrations_payment_slip_idx" ON "moon_registrations" USING btree ("payment_slip_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "moon_registrations" DROP CONSTRAINT "moon_registrations_payment_slip_id_media_id_fk";
  
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DEFAULT 'confirmed'::text;
  DROP TYPE "public"."enum_moon_registrations_status";
  CREATE TYPE "public"."enum_moon_registrations_status" AS ENUM('confirmed', 'waitlisted', 'cancelled');
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DEFAULT 'confirmed'::"public"."enum_moon_registrations_status";
  ALTER TABLE "moon_registrations" ALTER COLUMN "status" SET DATA TYPE "public"."enum_moon_registrations_status" USING "status"::"public"."enum_moon_registrations_status";
  DROP INDEX "moon_registrations_payment_slip_idx";
  ALTER TABLE "observe_moon_events" ALTER COLUMN "location" SET DEFAULT 'Colombo & Chapter Observatories';
  ALTER TABLE "moon_registrations" DROP COLUMN "selected_location";
  ALTER TABLE "moon_registrations" DROP COLUMN "payment_slip_id";
  ALTER TABLE "moon_registrations" DROP COLUMN "payment_status";
  ALTER TABLE "observe_moon_events" DROP COLUMN "is_paid";
  ALTER TABLE "observe_moon_events" DROP COLUMN "ticket_price";
  ALTER TABLE "observe_moon_events" DROP COLUMN "payment_details";
  DROP TYPE "public"."enum_moon_registrations_payment_status";`);
}
