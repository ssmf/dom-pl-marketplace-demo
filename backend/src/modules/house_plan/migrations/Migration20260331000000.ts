import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260331000000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "house_plan"
      add column if not exists "floors" integer not null default 1,
      add column if not exists "building_width" real null,
      add column if not exists "building_length" real null,
      add column if not exists "building_footprint" real null,
      add column if not exists "total_area" real null,
      add column if not exists "roof_type" text null,
      add column if not exists "roof_angle" real null,
      add column if not exists "garage" text null,
      add column if not exists "architectural_style" text null,
      add column if not exists "energy_standard" text null,
      add column if not exists "basement" text null,
      add column if not exists "building_height" real null,
      add column if not exists "fireplace" boolean null,
      add column if not exists "terrace" boolean null,
      add column if not exists "house_type" text null;`);

    this.addSql(`alter table if exists "house_plan" alter column "floors" drop default;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "house_plan"
      drop column if exists "floors",
      drop column if exists "building_width",
      drop column if exists "building_length",
      drop column if exists "building_footprint",
      drop column if exists "total_area",
      drop column if exists "roof_type",
      drop column if exists "roof_angle",
      drop column if exists "garage",
      drop column if exists "architectural_style",
      drop column if exists "energy_standard",
      drop column if exists "basement",
      drop column if exists "building_height",
      drop column if exists "fireplace",
      drop column if exists "terrace",
      drop column if exists "house_type";`);
  }

}
