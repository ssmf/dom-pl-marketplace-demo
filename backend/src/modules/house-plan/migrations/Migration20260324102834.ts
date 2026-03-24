import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324102834 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "house_plan" ("id" text not null, "title" text not null, "price" numeric not null, "description" text null, "house_area" integer not null, "boiler_room_area" integer null, "rooms" integer not null, "bathrooms_and_wc" integer not null, "plot_dimensions" text not null, "min_plot_dimensions_after_adaptation" text null, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "house_plan_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_house_plan_deleted_at" ON "house_plan" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "house_plan" cascade;`);
  }

}
