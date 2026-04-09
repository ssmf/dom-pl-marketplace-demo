import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260409152523 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "plan_family" drop constraint if exists "plan_family_vendor_id_name_unique";`);
    this.addSql(`create table if not exists "house_plan_image" ("id" text not null, "url" text not null, "type" text not null default 'gallery', "position" integer not null default 0, "alt" text null, "house_plan_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "house_plan_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_house_plan_image_house_plan_id" ON "house_plan_image" ("house_plan_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_house_plan_image_deleted_at" ON "house_plan_image" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "house_plan_image" add constraint "house_plan_image_house_plan_id_foreign" foreign key ("house_plan_id") references "house_plan" ("id") on update cascade;`);

    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_plan_family_vendor_id_name_unique" ON "plan_family" ("vendor_id", "name") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "house_plan_image" cascade;`);

    this.addSql(`drop index if exists "IDX_plan_family_vendor_id_name_unique";`);
  }

}
