import type { ComponentType } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion } from "framer-motion";
import { getQueryClient } from "@/lib/query-client";
import { I18nProvider, type Lang } from "@/lib/i18n";

const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation);

type WithLang<P> = P & { lang?: Lang };

/**
 * Tier 3 — i18n + framer-motion + react-query.
 *
 * Use for islands that fetch server data via TanStack Query. Includes
 * LazyMotion since virtually every data island also animates on mount.
 * QueryClient is a module-level singleton — safe to nest.
 */
export function withI18nQueryMotion<P extends object>(
  Component: ComponentType<P>,
): ComponentType<WithLang<P>> {
  const Wrapped = ({ lang, ...rest }: WithLang<P>) => (
    <QueryClientProvider client={getQueryClient()}>
      <I18nProvider initialLang={lang}>
        <LazyMotion features={loadFeatures} strict>
          <Component {...(rest as P)} />
        </LazyMotion>
      </I18nProvider>
    </QueryClientProvider>
  );
  Wrapped.displayName = `withI18nQueryMotion(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
