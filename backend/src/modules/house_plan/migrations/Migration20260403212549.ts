import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260403212549 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "plan_family" add column if not exists "vendor_id" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "plan_family" drop column if exists "vendor_id";`);
  }

}
