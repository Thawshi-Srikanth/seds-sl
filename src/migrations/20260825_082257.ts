import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "is_featured" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "custom_link" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_is_featured" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_custom_link" varchar;
  ALTER TABLE "observe_moon_events" ADD COLUMN "short_description" varchar;
  ALTER TABLE "observe_moon_events" ADD COLUMN "listing_image_id" integer;
  ALTER TABLE "observe_moon_events" ADD COLUMN "is_featured" boolean DEFAULT true;
  ALTER TABLE "observe_moon_events" ADD CONSTRAINT "observe_moon_events_listing_image_id_media_id_fk" FOREIGN KEY ("listing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "observe_moon_events_listing_image_idx" ON "observe_moon_events" USING btree ("listing_image_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "observe_moon_events" DROP CONSTRAINT "observe_moon_events_listing_image_id_media_id_fk";
  
  DROP INDEX "observe_moon_events_listing_image_idx";
  ALTER TABLE "projects" DROP COLUMN "is_featured";
  ALTER TABLE "projects" DROP COLUMN "custom_link";
  ALTER TABLE "_projects_v" DROP COLUMN "version_is_featured";
  ALTER TABLE "_projects_v" DROP COLUMN "version_custom_link";
  ALTER TABLE "observe_moon_events" DROP COLUMN "short_description";
  ALTER TABLE "observe_moon_events" DROP COLUMN "listing_image_id";
  ALTER TABLE "observe_moon_events" DROP COLUMN "is_featured";`);
}
