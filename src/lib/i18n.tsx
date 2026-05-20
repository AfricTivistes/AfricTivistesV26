import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import frTranslations from "@/data/translations/fr.json";
import enTranslations from "@/data/translations/en.json";

export type Lang = "fr" | "en";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

// Build the translations record from the JSON files
const translations: Record<string, Record<Lang, string>> = {};
for (const key of Object.keys(frTranslations) as Array<keyof typeof frTranslations>) {
  translations[key] = {
    fr: frTranslations[key],
    en: (enTranslations as Record<string, string>)[key] ?? frTranslations[key],
  };
}

// --- inline translations removed; sourced from src/data/translations/*.json ---
// kept for grep: "nav.home": { fr: "Accueil", en: "Home" },

const I18nContext = createContext<I18nContextType | null>(null);

function detectInitialLang(initialLang?: Lang): Lang {
  if (initialLang === "en" || initialLang === "fr") return initialLang;
  if (typeof document !== "undefined") {
    const htmlLang = document.documentElement.lang;
    if (htmlLang === "en" || htmlLang === "fr") return htmlLang;
  }
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/en")) return "en";
    if (path.startsWith("/fr")) return "fr";
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "fr") return saved;
    } catch {
      /* ignore */
    }
  }
  return "fr";
}

function navigateToLang(l: Lang) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("lang", l);
  } catch {
    /* ignore */
  }
  // Allow pages (e.g. BlogPost) to intercept and translate the slug
  // before we perform the default URL swap.
  const event = new CustomEvent("lang:request", {
    detail: { lang: l },
    cancelable: true,
  });
  window.dispatchEvent(event);
  if (event.defaultPrevented) return;

  const { pathname, search, hash } = window.location;
  let nextPath = pathname;
  if (pathname.startsWith("/fr") || pathname.startsWith("/en")) {
    nextPath = "/" + l + pathname.slice(3);
  } else {
    nextPath = "/" + l + (pathname === "/" ? "/" : pathname);
  }
  const nextUrl = nextPath + search + hash;

  // Use Astro's ClientRouter navigate (already loaded if View Transitions
  // are active). Access the cached module via the import map — no async
  // chunk load needed since ClientRouter is always in the page.
  const nav = (window as unknown as { __astro_navigate?: (url: string) => void }).__astro_navigate;
  if (nav) {
    nav(nextUrl);
  } else {
    // Fallback: try dynamic import (first navigation before cache is warm)
    import("astro:transitions/client")
      .then((m) => {
        if (typeof m.navigate === "function") {
          // Cache for subsequent calls
          (window as unknown as { __astro_navigate?: typeof m.navigate }).__astro_navigate = m.navigate;
          m.navigate(nextUrl);
        } else {
          window.location.href = nextUrl;
        }
      })
      .catch(() => {
        window.location.href = nextUrl;
      });
  }
}

export function translate(key: string, lang: Lang): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.fr || key;
}

/** Non-React alias for use in `.astro` files: `import { t } from "@/lib/i18n"` */
export const t = translate;

/**
 * Provider is now optional. When present, it overrides the detected language.
 * When absent, `useI18n` self-initializes from `<html lang>` / URL.
 *
 * Nested behaviour: when `initialLang` is not provided AND a parent
 * `I18nContext` is mounted, this provider becomes a pass-through (returns the
 * parent context). This prevents nested `withDataProviders` calls (e.g.
 * `ValuesHero` rendering `PageHero`) from resetting the language during SSR.
 */
export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const parent = useContext(I18nContext);
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang(initialLang));

  // Sync language with `<html lang>` attribute changes (e.g., after Astro view transition)
  useEffect(() => {
    const syncLang = () => {
      const detected = detectInitialLang();
      if (detected !== lang) setLangState(detected);
    };

    // Check immediately in case lang changed during navigation
    syncLang();

    // Watch for changes to the html lang attribute
    const observer = new MutationObserver(syncLang);
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
    }

    return () => observer.disconnect();
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    if (typeof window !== "undefined") {
      navigateToLang(l);
      return;
    }
    setLangState(l);
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  // Pass-through: parent context already provides a language and caller
  // didn't ask for an explicit override.
  if (parent && !initialLang) {
    return <>{children}</>;
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

/**
 * Context-free fallback used when no `I18nProvider` is mounted (typical Astro page).
 */
function useStandaloneI18n(): I18nContextType {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  // Sync language with `<html lang>` attribute whenever it changes
  useEffect(() => {
    const syncLang = () => {
      const detected = detectInitialLang();
      if (detected !== lang) setLangState(detected);
    };

    // Check immediately in case lang changed during navigation
    syncLang();

    // Watch for changes to the html lang attribute
    const observer = new MutationObserver(syncLang);
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
    }

    return () => observer.disconnect();
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    if (typeof window !== "undefined") {
      navigateToLang(l);
      return;
    }
    setLangState(l);
  }, []);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  return { lang, setLang, t };
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  // Fallback: no provider mounted (Astro page rendered directly).
  // We still call hooks unconditionally below to satisfy the rules of hooks.
  const standalone = useStandaloneI18n();
  return ctx ?? standalone;
}
