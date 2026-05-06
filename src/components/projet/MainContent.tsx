import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/router-shim";
import { ArrowLeft, ExternalLink } from "lucide-react";
import SectionHeading from "@/components/projet/SectionHeading";
import ActionAccordion from "@/components/projet/ActionAccordion";
import SidebarCard from "@/components/projet/SidebarCard";
import StatCard from "@/components/projet/StatCard";
import type { WPProjetMere } from "@/lib/wordpress";
import type { Lang } from "@/lib/i18n";

interface StatItem {
  value: string;
  label: string;
  emoji: string;
  href?: string;
}

interface MainContentProps {
  activeTab: "presentation" | "actions";
  contentHtml: string;
  actions: { action_titre: string; action_details: { detail_texte: string }[] }[];
  projetsMeres: WPProjetMere[];
  statsData: StatItem[];
  parentId: number;
  lang: Lang;
  t: (key: string) => string;
}

const MainContent = ({
  activeTab,
  contentHtml,
  actions,
  projetsMeres,
  statsData,
  parentId,
  lang,
  t,
}: MainContentProps) => {
  const hasSidebar = projetsMeres.length > 0 || statsData.length > 0 || parentId > 0;
  return (
  <section className="py-14 lg:py-20">
    <div className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

        {/* Main column */}
        <div className={hasSidebar ? "lg:col-span-8" : "lg:col-span-12"}>
          <AnimatePresence mode="wait">
            {activeTab === "presentation" ? (
              <motion.div
                key="presentation"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {contentHtml && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-foreground font-heading mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      {t("projet.presentation")}
                    </h3>
                    <div
                      className="prose prose-lg max-w-none
                        prose-headings:font-heading prose-headings:text-foreground
                        prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                        prose-h3:text-lg prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-muted-foreground prose-p:leading-[1.8]
                        prose-li:text-muted-foreground
                        prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto
                        prose-ul:pl-5 prose-ol:pl-5
                        prose-strong:text-foreground"
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <SectionHeading title={t("projet.actions")} />

                {actions.length > 0 ? (
                  <div className="space-y-4">
                    {actions.map((action, i) => (
                      <div key={i} id={`action_${i}`}>
                        <ActionAccordion
                          index={i}
                          title={action.action_titre}
                          details={action.action_details.map((d) => d.detail_texte)}
                          seeDetailsLabel={t("projet.seeDetails")}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {lang === "fr" ? "Aucune action définie pour le moment." : "No actions defined yet."}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        {hasSidebar && (
          <aside className="lg:col-span-4">
            <div className="sticky top-[140px] space-y-5">
            {/* Projets meres */}
            {projetsMeres.length > 0 && (
              <div id="projets-meres">
                <SidebarCard title={t("projet.projetsMeres")} delay={0.2}>
                  <div className="space-y-3">
                    {projetsMeres.map((pm) => (
                      <a
                        key={pm.id}
                        href={pm.pm_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-border p-3 hover:border-primary/20 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          {pm.pm_image ? (
                            <img
                              src={pm.pm_image}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-border"
                              width="32"
                              height="32"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <ExternalLink size={14} className="text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {pm.name}
                              <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0" />
                            </h4>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            pm.pm_statut === "termine"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}>
                            {pm.pm_statut === "termine"
                              ? (lang === "fr" ? "Terminé" : "Completed")
                              : (lang === "fr" ? "En cours" : "In progress")}
                          </span>
                        </div>
                        {pm.pm_description && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed ">{pm.pm_description}</p>
                        )}
                      </a>
                    ))}
                  </div>
                </SidebarCard>
              </div>
            )}

            {/* Chiffres cles */}
            {statsData.length > 0 && (
              <div id="chiffres-cles">
                <SidebarCard title={t("projet.keyFigures")} delay={0.3}>
                  <div className="grid grid-cols-2 gap-2.5">
                    {statsData.map((stat, i) => {
                      return (
                        <StatCard
                          key={stat.label}
                          emoji={stat.emoji}
                          value={stat.value}
                          label={stat.label}
                          href={stat.href}
                          delay={0.3 + i * 0.04}
                        />
                      );
                    })}
                  </div>
                </SidebarCard>
              </div>
            )}

            {/* Projet parent (si declinaison pays) */}
            {parentId > 0 && (
              <SidebarCard title={t("projet.parentProjet")} delay={0.5}>
                <Link
                  to={`/initiatives/${parentId}`}
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  {lang === "fr" ? "Voir le projet principal" : "View main project"}
                </Link>
              </SidebarCard>
            )}
            </div>
          </aside>
        )}
      </div>
    </div>
  </section>
  );
};

export default MainContent;
