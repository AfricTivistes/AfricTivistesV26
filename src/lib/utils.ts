import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detecte le niveau de precision d'une date ACF.
 * Formats acceptes : YYYY, YYYYMM, YYYY-MM, YYYYMMDD, YYYY-MM-DD
 */
type DatePrecision = "year" | "month" | "full";

function detectPrecision(d: string): DatePrecision {
  const clean = d.replace(/-/g, "");
  if (clean.length <= 4) return "year";
  if (clean.length <= 6) return "month";
  return "full";
}

/**
 * Normalise une date ACF en "YYYY-MM-DD" parseable.
 * - isEnd = true : pour une date de fin, on prend le dernier jour de la periode
 * - isEnd = false : pour une date de debut, on prend le premier jour
 */
function normalizeAcfDate(d: string, isEnd = false): string {
  const clean = d.replace(/-/g, "");
  if (clean.length <= 4) {
    // Annee seule : YYYY
    const year = clean.padEnd(4, "0");
    return isEnd ? `${year}-12-31` : `${year}-01-01`;
  }
  if (clean.length <= 6) {
    // Mois + annee : YYYYMM
    const year = clean.slice(0, 4);
    const month = clean.slice(4, 6);
    if (isEnd) {
      // Dernier jour du mois
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      return `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
    }
    return `${year}-${month}-01`;
  }
  // Date complete : YYYYMMDD
  return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
}

export function computeProgress(startDate: string, endDate: string): number {
  const now = Date.now();
  const start = new Date(normalizeAcfDate(startDate, false)).getTime();
  const end = new Date(normalizeAcfDate(endDate, true)).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

export function formatDate(dateStr: string, lang: string): string {
  const precision = detectPrecision(dateStr);
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  if (precision === "year") {
    return dateStr.replace(/-/g, "").slice(0, 4);
  }

  if (precision === "month") {
    const d = new Date(normalizeAcfDate(dateStr));
    return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
  }

  const d = new Date(normalizeAcfDate(dateStr));
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}
