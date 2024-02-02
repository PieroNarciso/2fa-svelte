import { type ColumnType, type Generated, type Insertable, type Selectable, type Updateable } from 'kysely';

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  id: Generated<number>;
  username: string;
  password: string;
  twofa_secret?: string;
  twofa_enabled?: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;
