import { DB } from './client';
import { SQL, sql, WithSubquery } from 'drizzle-orm';

/**
 * Convert a cross-table expression to a JSON array, which will then appear as a single item in the results
 */
export const cteToJson = <T extends WithSubquery>(query: T) => {
  // TODO: the types are a bit wrong on `['selectedFields']` here. It thinks it's selecting the columns including metadata, instead of the actual data type

  return sql<
    T['_']['selectedFields'][]
  >`(SELECT json_agg(row_to_json(${query})) FROM ${query})`;
};

/**
 * Execute multiple independent queries and return the results as a single array
 */
export const executeMultiQuery = async <
  TQueries extends Record<string, WithSubquery>
>(
  db: DB,
  select: TQueries
) => {
  const queries = [...Object.entries(select)];

  if (queries.length === 0) {
    return [];
  }

  type QueryResults = {
    [K in keyof typeof select]: SQL.Aliased<
      (typeof select)[K]['_']['selectedFields'][]
    >;
  };

  const selectQuery = queries.reduce<QueryResults>(
    (acc, [alias, query]) => ({
      ...acc,
      [alias]: cteToJson(query).as(alias),
    }),
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as QueryResults
  );

  return await db
    .with(...queries.map(([, query]) => query))
    .select(selectQuery)
    .from(queries[0]![1]);
};
