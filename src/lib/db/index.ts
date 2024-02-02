import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { type Database } from "./types";

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database: 'postgres',
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432
  })
})

export const db = new Kysely<Database>({
  dialect
})

export type MyDatabase = typeof db;
