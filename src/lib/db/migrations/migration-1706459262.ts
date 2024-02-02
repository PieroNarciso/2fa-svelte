import { Kysely, sql } from "kysely";
import type { Database } from "../types";


export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('username', 'varchar', (col) => col.notNull())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .dropTable('users')
    .execute();
}
