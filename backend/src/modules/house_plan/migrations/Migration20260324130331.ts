import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260324130331 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "house_plan" add column if not exists "img" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "house_plan" drop column if exists "img";`);
  }

}
