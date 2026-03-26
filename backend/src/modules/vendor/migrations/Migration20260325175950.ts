import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260325175950 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "vendor" ("id" text not null, "company_name" text not null, "first_name" text not null, "last_name" text not null, "email" text not null, "published_plans_count" integer not null default 0, "revenue" numeric not null default 0, "orders_count" integer not null default 0, "average_rating" integer null, "raw_revenue" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vendor_deleted_at" ON "vendor" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "vendor" cascade;`);
  }

}
