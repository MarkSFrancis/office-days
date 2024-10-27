import { MutationCache, Query, QueryClient } from '@tanstack/react-query';

export const createQueryClient = () => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      // Invalidate all queries whenever any data is changed via a mutation
      // Note that this doesn't include navigation events (such as a Form submission)
      onSuccess: async () => {
        await bustQueryCache(queryClient);
      },
    }),
    defaultOptions: {
      // Don't retry failures in dev, so that errors show up faster
      queries: import.meta.env.DEV
        ? {
            retry: false,
            retryOnMount: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          }
        : {},
      mutations: import.meta.env.DEV
        ? {
            retry: false,
          }
        : {},
    },
  });

  return queryClient;
};

/**
 * Invalidate all dynamic queries (excludes queries with an infinite stale time)
 */
export const bustQueryCache = async (queryClient: QueryClient) => {
  const nonStaticQueries = (query: Query) => {
    const defaultStaleTime =
      queryClient.getQueryDefaults(query.queryKey).staleTime ?? 0;
    const staleTimes = query.observers
      .map((observer) => observer.options.staleTime)
      .filter((staleTime) => typeof staleTime === 'number');

    const staleTime =
      query.getObserversCount() > 0
        ? Math.min(...staleTimes)
        : defaultStaleTime;

    // Don't invalidate queries with infinite stale time
    return staleTime !== Number.POSITIVE_INFINITY;
  };

  await queryClient.invalidateQueries({
    queryKey: undefined, // Invalidate all queries
    predicate: nonStaticQueries,
  });
};
