import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260403203718 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "plan_family" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plan_family_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_plan_family_deleted_at" ON "plan_family" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "house_plan" add column if not exists "family_id" text null;`);
    this.addSql(`alter table if exists "house_plan" alter column "building_width" type integer using ("building_width"::integer);`);
    this.addSql(`alter table if exists "house_plan" alter column "building_length" type integer using ("building_length"::integer);`);
    this.addSql(`alter table if exists "house_plan" alter column "building_footprint" type integer using ("building_footprint"::integer);`);
    this.addSql(`alter table if exists "house_plan" alter column "total_area" type integer using ("total_area"::integer);`);
    this.addSql(`alter table if exists "house_plan" alter column "roof_angle" type integer using ("roof_angle"::integer);`);
    this.addSql(`alter table if exists "house_plan" alter column "building_height" type integer using ("building_height"::integer);`);
    this.addSql(`alter table if exists "house_plan" add constraint "house_plan_family_id_foreign" foreign key ("family_id") references "plan_family" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_house_plan_family_id" ON "house_plan" ("family_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "house_plan" drop constraint if exists "house_plan_family_id_foreign";`);

    this.addSql(`drop table if exists "plan_family" cascade;`);

    this.addSql(`drop index if exists "IDX_house_plan_family_id";`);
    this.addSql(`alter table if exists "house_plan" drop column if exists "family_id";`);

    this.addSql(`alter table if exists "house_plan" alter column "building_width" type real using ("building_width"::real);`);
    this.addSql(`alter table if exists "house_plan" alter column "building_length" type real using ("building_length"::real);`);
    this.addSql(`alter table if exists "house_plan" alter column "building_footprint" type real using ("building_footprint"::real);`);
    this.addSql(`alter table if exists "house_plan" alter column "total_area" type real using ("total_area"::real);`);
    this.addSql(`alter table if exists "house_plan" alter column "roof_angle" type real using ("roof_angle"::real);`);
    this.addSql(`alter table if exists "house_plan" alter column "building_height" type real using ("building_height"::real);`);
  }

}
