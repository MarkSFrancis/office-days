import type { Table } from 'drizzle-orm';

export type RawSqlTable<T extends Table> = {
  [K in keyof T['_']['columns'] as T['_']['columns'][K]['_']['name']]: T['_']['columns'][K]['_']['notNull'] extends true
    ? T['_']['columns'][K]['_']['data']
    : T['_']['columns'][K]['_']['data'] | null;
};
