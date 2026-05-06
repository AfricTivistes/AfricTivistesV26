import { Link } from "@/lib/router-shim";
import { m as motion } from "framer-motion";
import { ChevronRight, Globe, MapPin } from "lucide-react";
import { getCountryName } from "@/lib/wordpress";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface HeroSectionProps {
  title: string;
  imageUrl: string | null;
  thematiqueName?: string;
  thematiqueSlug?: string;
  pays: string[];
  lang: Lang;
}

const HeroSection = ({ title, imageUrl, thematiqueName, thematiqueSlug, pays, lang }: HeroSectionProps) => {
  const { t } = useI18n();
  const thematiqueRoute = thematiqueSlug ? `/initiatives/${thematiqueSlug.replace(/-en$/, "")}` : null;
  const sortedPays = [...pays].sort((a, b) => (a === "PANAF" ? -1 : b === "PANAF" ? 1 : 0));
  return (
  <section className="relative overflow-hidden min-h-[420px] lg:min-h-[520px] flex items-end">
    <div className="absolute inset-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover scale-105"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
      ) : (
        <div className="w-full h-full hero-gradient" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
      <div className="absolute inset-0 pattern-african opacity-[0.07]" />
    </div>

    <div className="relative section-container pb-20 lg:pb-24 pt-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-8">
          <Link to="/" className="hover:text-white/80 transition-colors">
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link to="/initiatives" className="hover:text-white/80 transition-colors">
            {lang === "fr" ? "Initiatives" : "Initiatives"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/70 truncate max-w-[200px]">{title}</span>
        </nav>

        {/* Badge thematique */}
        {thematiqueName && (
          <div className="flex items-center gap-3 mb-5">
            {thematiqueRoute ? (
              <Link
                to={thematiqueRoute}
                className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {thematiqueName}
              </Link>
            ) : (
              <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                {thematiqueName}
              </span>
            )}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold text-white leading-[1.08] mb-8 font-heading max-w-4xl">
          {title}
        </h1>

        {/* Country tags */}
        {pays.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sortedPays.map((code, i) => (
              <motion.span
                key={code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
              >
                {code === "PANAF" ? <Globe size={12} /> : <MapPin size={12} />}
                {code === "PANAF" ? t("country.panafricain") : getCountryName(code)}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  </section>
  );
};

export default HeroSection;
