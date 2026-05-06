import type { ComponentType } from "react";
import { I18nProvider, type Lang } from "@/lib/i18n";

type WithLang<P> = P & { lang?: Lang };

/**
 * Tier 1 — i18n only.
 *
 * Smallest possible footprint: no Query, no framer-motion, no Tooltip.
 * Use for islands that don't fetch data and don't animate.
 */
export function withI18n<P extends object>(
  Component: ComponentType<P>,
): ComponentType<WithLang<P>> {
  const Wrapped = ({ lang, ...rest }: WithLang<P>) => (
    <I18nProvider initialLang={lang}>
      <Component {...(rest as P)} />
    </I18nProvider>
  );
  Wrapped.displayName = `withI18n(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
