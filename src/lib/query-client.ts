import { QueryClient } from "@tanstack/react-query";

/**
 * Module-level singleton QueryClient shared across all Astro page islands.
 * Created lazily so SSR doesn't accidentally create one per request.
 */
let _client: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (_client) return _client;
  _client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  hydratePreload(_client);
  return _client;
}

/**
 * Hydrate the QueryClient cache from `window.__PRELOAD__` injected by Astro
 * pages that prefetched data server-side. Each entry is `{ key, data }`
 * matching the queryKey used by the corresponding hook.
 */
function hydratePreload(client: QueryClient): void {
  if (typeof window === "undefined") return;
  const preload = (window as unknown as { __PRELOAD__?: Array<{ key: unknown[]; data: unknown }> }).__PRELOAD__;
  if (!Array.isArray(preload)) return;
  for (const entry of preload) {
    if (entry && Array.isArray(entry.key)) {
      client.setQueryData(entry.key, entry.data);
    }
  }
}
