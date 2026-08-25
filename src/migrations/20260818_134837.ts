import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_moon_registrations_attendance_mode" AS ENUM('in-person', 'virtual', 'watch-party');
  CREATE TYPE "public"."enum_moon_registrations_equipment" AS ENUM('bringing-equipment', 'observer', 'astrophotography');
  CREATE TYPE "public"."enum_moon_registrations_status" AS ENUM('confirmed', 'waitlisted', 'cancelled');
  CREATE TYPE "public"."enum_observe_moon_events_status" AS ENUM('published', 'draft');
  CREATE TABLE "moon_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"institution" varchar NOT NULL,
  	"year" varchar DEFAULT '2026' NOT NULL,
  	"event_slug" varchar DEFAULT 'observe-the-moon-night-2026' NOT NULL,
  	"attendance_mode" "enum_moon_registrations_attendance_mode" DEFAULT 'in-person',
  	"equipment" "enum_moon_registrations_equipment" DEFAULT 'observer',
  	"notes" varchar,
  	"status" "enum_moon_registrations_status" DEFAULT 'confirmed',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "observe_moon_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"event_date" varchar DEFAULT 'October 24, 2026',
  	"event_time" varchar DEFAULT '06:30 PM - 10:30 PM IST',
  	"location" varchar DEFAULT 'Colombo & Chapter Observatories',
  	"description" varchar,
  	"hero_image_id" integer,
  	"status" "enum_observe_moon_events_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "moon_registrations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "observe_moon_events_id" integer;
  ALTER TABLE "observe_moon_events" ADD CONSTRAINT "observe_moon_events_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "moon_registrations_year_idx" ON "moon_registrations" USING btree ("year");
  CREATE INDEX "moon_registrations_event_slug_idx" ON "moon_registrations" USING btree ("event_slug");
  CREATE INDEX "moon_registrations_updated_at_idx" ON "moon_registrations" USING btree ("updated_at");
  CREATE INDEX "moon_registrations_created_at_idx" ON "moon_registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "observe_moon_events_year_idx" ON "observe_moon_events" USING btree ("year");
  CREATE INDEX "observe_moon_events_hero_image_idx" ON "observe_moon_events" USING btree ("hero_image_id");
  CREATE INDEX "observe_moon_events_updated_at_idx" ON "observe_moon_events" USING btree ("updated_at");
  CREATE INDEX "observe_moon_events_created_at_idx" ON "observe_moon_events" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_moon_registrations_fk" FOREIGN KEY ("moon_registrations_id") REFERENCES "public"."moon_registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_observe_moon_events_fk" FOREIGN KEY ("observe_moon_events_id") REFERENCES "public"."observe_moon_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_moon_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("moon_registrations_id");
  CREATE INDEX "payload_locked_documents_rels_observe_moon_events_id_idx" ON "payload_locked_documents_rels" USING btree ("observe_moon_events_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "moon_registrations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "observe_moon_events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "moon_registrations" CASCADE;
  DROP TABLE "observe_moon_events" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_moon_registrations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_observe_moon_events_fk";
  
  DROP INDEX "payload_locked_documents_rels_moon_registrations_id_idx";
  DROP INDEX "payload_locked_documents_rels_observe_moon_events_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "moon_registrations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "observe_moon_events_id";
  DROP TYPE "public"."enum_moon_registrations_attendance_mode";
  DROP TYPE "public"."enum_moon_registrations_equipment";
  DROP TYPE "public"."enum_moon_registrations_status";
  DROP TYPE "public"."enum_observe_moon_events_status";`);
}
