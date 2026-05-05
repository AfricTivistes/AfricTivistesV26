import type { ComponentType } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { getQueryClient } from "@/lib/query-client";

/**
 * Wraps a page component with the global providers needed by the app:
 *   - React Query (singleton client)
 *   - Radix Tooltip
 *   - Toaster + Sonner
 *
 * i18n and routing are handled implicitly via `<html lang>` and
 * `window.__ASTRO_PARAMS__`, so no provider is needed for them.
 */
export function withProviders<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  const Wrapped = (props: P) => (
    <QueryClientProvider client={getQueryClient()}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Component {...props} />
      </TooltipProvider>
    </QueryClientProvider>
  );
  Wrapped.displayName = `withProviders(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
