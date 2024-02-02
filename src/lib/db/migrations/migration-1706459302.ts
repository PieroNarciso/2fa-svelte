import { Kysely, sql } from "kysely";
import type { Database } from "../types";


export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('twofa_secret', 'varchar')
    .addColumn('twofa_enabled', 'boolean', (col) => col.defaultTo(false))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .dropTable('users')
    .execute();
}
