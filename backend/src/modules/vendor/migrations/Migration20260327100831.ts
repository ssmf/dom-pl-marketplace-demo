import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260327100831 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vendor" drop column if exists "published_plans_count", drop column if exists "orders_count";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "vendor" add column if not exists "published_plans_count" integer not null default 0, add column if not exists "orders_count" integer not null default 0;`);
  }

}
