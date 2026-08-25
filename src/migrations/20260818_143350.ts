import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_observe_moon_events_partners_partnership_type" AS ENUM('Sponsor', 'Global Partner', 'Academic Partner', 'Media Partner', 'Equipment Partner');
  CREATE TABLE "observe_moon_events_agenda" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL,
  	"stage" varchar DEFAULT 'PHASE 01',
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "observe_moon_events_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"city" varchar,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"is_primary" boolean DEFAULT false
  );
  
  CREATE TABLE "observe_moon_events_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"partnership_type" "enum_observe_moon_events_partners_partnership_type" DEFAULT 'Sponsor',
  	"website_url" varchar
  );
  
  ALTER TABLE "observe_moon_events_agenda" ADD CONSTRAINT "observe_moon_events_agenda_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."observe_moon_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "observe_moon_events_locations" ADD CONSTRAINT "observe_moon_events_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."observe_moon_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "observe_moon_events_partners" ADD CONSTRAINT "observe_moon_events_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "observe_moon_events_partners" ADD CONSTRAINT "observe_moon_events_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."observe_moon_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "observe_moon_events_agenda_order_idx" ON "observe_moon_events_agenda" USING btree ("_order");
  CREATE INDEX "observe_moon_events_agenda_parent_id_idx" ON "observe_moon_events_agenda" USING btree ("_parent_id");
  CREATE INDEX "observe_moon_events_locations_order_idx" ON "observe_moon_events_locations" USING btree ("_order");
  CREATE INDEX "observe_moon_events_locations_parent_id_idx" ON "observe_moon_events_locations" USING btree ("_parent_id");
  CREATE INDEX "observe_moon_events_partners_order_idx" ON "observe_moon_events_partners" USING btree ("_order");
  CREATE INDEX "observe_moon_events_partners_parent_id_idx" ON "observe_moon_events_partners" USING btree ("_parent_id");
  CREATE INDEX "observe_moon_events_partners_logo_idx" ON "observe_moon_events_partners" USING btree ("logo_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "observe_moon_events_agenda" CASCADE;
  DROP TABLE "observe_moon_events_locations" CASCADE;
  DROP TABLE "observe_moon_events_partners" CASCADE;
  DROP TYPE "public"."enum_observe_moon_events_partners_partnership_type";`);
}
