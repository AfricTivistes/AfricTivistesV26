import type { ComponentType } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { getQueryClient } from "@/lib/query-client";
import { I18nProvider, type Lang } from "@/lib/i18n";

type WithLang<P> = P & { lang?: Lang };

/**
 * Full providers — used by full pages (one per page render):
 *   - React Query (singleton client)
 *   - I18n (forced language for SSR — no flash)
 *   - Radix Tooltip
 *   - Toaster + Sonner (UI, must be mounted only once per page)
 *
 * When `lang` prop is provided (from Astro `.astro` page), it overrides any
 * URL/localStorage detection during SSR, preventing the i18n FOUC.
 */
export function withProviders<P extends object>(Component: ComponentType<P>): ComponentType<WithLang<P>> {
  const Wrapped = ({ lang, ...rest }: WithLang<P>) => (
    <QueryClientProvider client={getQueryClient()}>
      <I18nProvider initialLang={lang}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Component {...(rest as P)} />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
  Wrapped.displayName = `withProviders(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}

/**
 * Lightweight providers — used by individual island components so each
 * Astro `client:*` island carries its own React context tree. Excludes
 * Toaster/Sonner (these must be mounted exactly once per page via
 * `<ToastersIsland />`).
 *
 * Both providers are safe to nest:
 *  - QueryClientProvider uses a module-level singleton (shared cache)
 *  - TooltipProvider is idempotent
 */
export function withDataProviders<P extends object>(Component: ComponentType<P>): ComponentType<WithLang<P>> {
  const Wrapped = ({ lang, ...rest }: WithLang<P>) => (
    <QueryClientProvider client={getQueryClient()}>
      <I18nProvider initialLang={lang}>
        <TooltipProvider>
          <Component {...(rest as P)} />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
  Wrapped.displayName = `withDataProviders(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
