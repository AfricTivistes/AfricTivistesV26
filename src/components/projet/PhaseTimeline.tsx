import { m as motion } from "framer-motion";
import { ArrowRight, Calendar, Globe } from "lucide-react";
import { computeProgress, formatDate } from "@/lib/utils";
import { getCountryName, stripHtml } from "@/lib/wordpress";
import type { WPPartenaire, ProjetPhase } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface PhaseTimelineProps {
  phases: ProjetPhase[];
  partenaireMap: Map<number, WPPartenaire>;
  phasesLabel: string;
  phasesDesc: string;
  lang: Lang;
}

const PhaseTimeline = ({ phases, partenaireMap, phasesLabel, phasesDesc, lang }: PhaseTimelineProps) => {
  const { t } = useI18n();
  return (
  <section className="py-16 lg:py-24 border-t border-border overflow-hidden">
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground font-heading">
          {phasesLabel}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
          {phasesDesc}
        </p>
      </motion.div>

      <div className="relative">
        {/* Ligne centrale desktop */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-primary/25 via-border to-transparent pointer-events-none" />

        <div className="space-y-5 lg:space-y-10">
          {phases.map((phase, i) => {
            const partners = (phase.phase_partenaires || [])
              .map((id) => partenaireMap.get(id))
              .filter((p): p is WPPartenaire => !!p);
            const partnerName = partners.length
              ? partners.map((p) => stripHtml(p.title.rendered)).join(", ")
              : phase.phase_titre || "";
            const countryFlags = phase.phase_pays
              ?.map((code) => ({ code, name: code === "PANAF" ? t("country.panafricain") : getCountryName(code) }))
              .sort((a, b) => (a.code === "PANAF" ? -1 : b.code === "PANAF" ? 1 : 0)) || [];
            const isLeft = i % 2 === 0;

            const phaseProgress = phase.phase_date_debut && phase.phase_date_fin
              ? computeProgress(phase.phase_date_debut, phase.phase_date_fin)
              : null;
            const statusLabel = phaseProgress === null ? null
              : phaseProgress >= 100 ? (lang === "fr" ? "Terminé" : "Completed")
              : phaseProgress > 0 ? (lang === "fr" ? "En cours" : "Ongoing")
              : (lang === "fr" ? "À venir" : "Upcoming");
            const statusClass = phaseProgress === null ? ""
              : phaseProgress >= 100 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : phaseProgress > 0 ? "bg-accent/10 text-accent border-accent/20"
              : "bg-muted text-muted-foreground border-border";
            const dotClass = phaseProgress === null ? "bg-border"
              : phaseProgress >= 100 ? "bg-emerald-500"
              : phaseProgress > 0 ? "bg-accent animate-pulse"
              : "bg-muted-foreground/40";

            const cardJsx = (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.08, type: "spring", stiffness: 120, damping: 20 }}
                className="group relative rounded-2xl border border-border bg-card p-5 lg:p-6 hover:border-primary/25 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Numéro en filigrane */}
                <span className="absolute -bottom-3 -right-2 text-8xl font-black text-muted-foreground/5 leading-none select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* En-tête */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    Phase {String(i + 1).padStart(2, "0")}
                  </span>
                  {statusLabel && (
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                      {statusLabel}
                    </span>
                  )}
                </div>

                {/* Titre */}
                <h3 className="text-sm lg:text-[15px] font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
                  {phase.phase_titre || partnerName}
                </h3>
                {phase.phase_titre && partnerName !== phase.phase_titre && (
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{partnerName}</p>
                )}

                {/* Dates */}
                {phase.phase_date_debut && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/60 mt-2 mb-4">
                    <Calendar size={11} className="text-primary/60 shrink-0" />
                    <span className="text-[11px] font-semibold text-foreground/70">
                      {formatDate(phase.phase_date_debut, lang)}
                    </span>
                    {phase.phase_date_fin && (
                      <>
                        <ArrowRight size={9} className="text-muted-foreground/40 shrink-0" />
                        <span className="text-[11px] font-semibold text-foreground/70">
                          {formatDate(phase.phase_date_fin, lang)}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Barre de progression */}
                {phaseProgress !== null && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">{lang === "fr" ? "Avancement" : "Progress"}</span>
                      <span className="text-[10px] font-bold text-primary">{phaseProgress}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${phaseProgress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
                      />
                    </div>
                  </div>
                )}

                {/* Drapeaux pays */}
                {countryFlags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {countryFlags.map((c) => (
                      <a
                        key={c.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors text-[11px] font-medium text-muted-foreground border border-border/40 hover:border-primary/20"
                      >
                        {c.code === "PANAF" ? (
                          <Globe size={14} className="text-primary/70 shrink-0" />
                        ) : (
                          <img
                            src={`https://flagcdn.com/20x15/${c.code.toLowerCase()}.png`}
                            alt={c.name}
                            className="w-4 h-3 object-cover rounded-[2px] shadow-xs"
                            width="20"
                            height="15"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        {c.name}
                      </a>
                    ))}
                  </div>
                )}

                {/* Logos partenaires */}
                {partners.filter((p) => p.acf?.logo && typeof p.acf.logo === "string").length > 0 && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2.5">
                      {lang === "fr" ? "Partenaire(s)" : "Partner(s)"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {partners.map((p) => {
                        const logo = typeof p.acf?.logo === "string" ? p.acf.logo : "";
                        return logo ? (
                          <a
                            key={p.id}
                            href={p.acf?.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={stripHtml(p.title.rendered)}
                            className="flex items-center justify-center w-10 h-10 lg:w-20 lg:h-20 rounded-xl border border-border/40 bg-white/90 dark:bg-white/8 overflow-hidden p-1 hover:shadow-md hover:border-primary/20 hover:scale-[1.03] transition-all duration-200"
                          >
                            <img
                              src={logo}
                              alt={stripHtml(p.title.rendered)}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              decoding="async"
                              width="80"
                              height="80"
                            />
                          </a>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );

            return (
              <div key={i} className="relative">
                {/* Desktop : grille alternée */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
                  {isLeft ? <>{cardJsx}<div /></> : <><div />{cardJsx}</>}
                </div>

                {/* Noeud central desktop */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-5 z-10">
                  <div className="w-10 h-10 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center shadow-lg ring-4 ring-background">
                    <span className="text-[11px] font-black text-primary">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </div>

                {/* Mobile : liste verticale */}
                <div className="lg:hidden flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center shadow-xs ring-2 ring-background mt-0.5">
                      <span className="text-[10px] font-black text-primary">{i + 1}</span>
                    </div>
                    {i < phases.length - 1 && (
                      <div className="w-px flex-1 min-h-[24px] mt-2 bg-linear-to-b from-border to-transparent" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">{cardJsx}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);
};

export default PhaseTimeline;
