import { withProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import { Target, Heart, Users, Globe, GraduationCap, Network, Wrench, Megaphone } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import TwoColumnTextImage from "@/components/TwoColumnTextImage";
import SectionHeader from "@/components/SectionHeader";
import CtaBanner from "@/components/CtaBanner";
import WebPlatforms from "@/components/WebPlatforms";
import ImpactMap from "@/components/ImpactMap";
import { useI18n } from "@/lib/i18n";

const valuesDef = [
  { icon: Target, titleKey: "about.val1Title", descKey: "about.val1Desc" },
  { icon: Heart, titleKey: "about.val2Title", descKey: "about.val2Desc" },
  { icon: Users, titleKey: "about.val3Title", descKey: "about.val3Desc" },
  { icon: Globe, titleKey: "about.val4Title", descKey: "about.val4Desc" },
];

const approachDef = [
  { icon: GraduationCap, titleKey: "about.approach1Title", descKey: "about.approach1Desc", color: "bg-primary" },
  { icon: Network, titleKey: "about.approach2Title", descKey: "about.approach2Desc", color: "bg-secondary" },
  { icon: Wrench, titleKey: "about.approach3Title", descKey: "about.approach3Desc", color: "bg-accent" },
  { icon: Megaphone, titleKey: "about.approach4Title", descKey: "about.approach4Desc", color: "bg-primary" },
];

const galleryImages = [
  { src: "https://citizenlabbenin.org/_astro/formation1.bc0f03e8_daRtv.webp", alt: "Engagement citoyen" },
  { src: "https://update.africtivistes.org/wp-content/uploads/2025/11/image.jpeg", alt: "Voix panafricaine" },
  { src: "https://update.africtivistes.org/wp-content/uploads/2023/11/IMG_1642-2-1-scaled.jpg", alt: "Innovation numérique" },
];

const About = () => {
  const { t } = useI18n();

  return (
    <PageLayout>
      <PageHero
        backgroundImage="https://update.africtivistes.org/wp-content/uploads/2026/02/Ucad-Senegal.jpg"
        labelKey="nav.about"
        titleKey="about.title"
        subtitleKey="about.subtitle"
      />

      <TwoColumnTextImage
        labelKey="about.missionTitle"
        titleKey="about.missionSubtitle1"
        highlightKey="about.missionHighlight"
        descriptions={["about.mission1", "about.mission2"]}
        imageUrl="https://update.africtivistes.org/wp-content/uploads/2026/02/Ucad-Senegal.jpg"
        imageAlt="AfricTivistes en action"
      />

      {/* Notre approche */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="section-container">
          <SectionHeader labelKey="about.approachTitle" titleKey="about.approachSubtitle" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approachDef.map((a, i) => (
              <motion.div
                key={a.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all group text-center"
              >
                <div className={`w-14 h-14 rounded-xl ${a.color}/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <a.icon size={28} className={`${a.color === "bg-secondary" ? "text-secondary" : a.color === "bg-accent" ? "text-accent" : "text-primary"}`} />
                </div>
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-2">{t(a.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(a.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie illustrative */}
      <section className="py-12 lg:py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl overflow-hidden shadow-md group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.alt}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="section-container">
          <SectionHeader labelKey="about.valuesTitle" titleKey="about.valuesSubtitle" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesDef.map((v, i) => (
              <motion.div
                key={v.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-7 border border-border text-center hover:border-primary/20 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-heading text-lg font-bold text-card-foreground mb-3">{t(v.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ImpactMap />

      <CtaBanner
        titleKey="about.ctaTitle"
        descKey="about.ctaDesc"
        btnKey="about.ctaBtn"
        linkTo="/contact"
      />

      <WebPlatforms />
    </PageLayout>
  );
};

export default withProviders(About);
