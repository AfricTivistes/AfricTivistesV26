import type { ComponentType } from "react";
import { LazyMotion } from "framer-motion";
import { I18nProvider, type Lang } from "@/lib/i18n";

// Lazy-loaded animation features keep framer-motion out of the critical path.
// `domAnimation` adds ~21KB min only when an island actually animates (after hydration).
const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation);

type WithLang<P> = P & { lang?: Lang };

/**
 * Tier 2 — i18n + framer-motion (LazyMotion).
 *
 * Use for islands that animate but don't fetch server data. The
 * `domAnimation` feature pack is loaded lazily only when motion components
 * actually render, so the initial provider chunk stays small.
 */
export function withI18nMotion<P extends object>(
  Component: ComponentType<P>,
): ComponentType<WithLang<P>> {
  const Wrapped = ({ lang, ...rest }: WithLang<P>) => (
    <I18nProvider initialLang={lang}>
      <LazyMotion features={loadFeatures} strict>
        <Component {...(rest as P)} />
      </LazyMotion>
    </I18nProvider>
  );
  Wrapped.displayName = `withI18nMotion(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
