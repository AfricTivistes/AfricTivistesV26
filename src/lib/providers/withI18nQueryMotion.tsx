import type { ComponentType } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion } from "framer-motion";
import { getQueryClient, hydratePreloadOnce } from "@/lib/query-client";
import { I18nProvider, type Lang } from "@/lib/i18n";

const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation);

type WithLang<P> = P & { lang?: Lang };

/**
 * Tier 3 — i18n + framer-motion + react-query.
 *
 * Use for islands that fetch server data via TanStack Query. Includes
 * LazyMotion since virtually every data island also animates on mount.
 * QueryClient is a module-level singleton — safe to nest.
 *
 * Hydrates the TanStack cache from `window.__PRELOAD__` synchronously
 * before the first render so components immediately see cached data
 * instead of flashing a loading skeleton.
 */
export function withI18nQueryMotion<P extends object>(
  Component: ComponentType<P>,
): ComponentType<WithLang<P>> {
  const Wrapped = ({ lang, ...rest }: WithLang<P>) => {
    // Hydrate SSR-preloaded data into the cache synchronously before render.
    // Since these islands use client:load (no SSR HTML), there is no
    // hydration mismatch risk — React does a full client render.
    hydratePreloadOnce();

    return (
      <QueryClientProvider client={getQueryClient()}>
        <I18nProvider initialLang={lang}>
          <LazyMotion features={loadFeatures} strict>
            <Component {...(rest as P)} />
          </LazyMotion>
        </I18nProvider>
      </QueryClientProvider>
    );
  };
  Wrapped.displayName = `withI18nQueryMotion(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
