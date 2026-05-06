import { withDataProviders } from "@/lib/withProviders";
import { m as motion } from "framer-motion";
import { type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

interface TwoColumnTextImageProps {
  labelKey: string;
  titleKey: string;
  highlightKey?: string;
  descriptions: string[];
  imageUrl: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  sectionBg?: string;
  children?: ReactNode;
}

const TwoColumnTextImage = ({
  labelKey,
  titleKey,
  highlightKey,
  descriptions,
  imageUrl,
  imageAlt,
  imagePosition = "right",
  sectionBg,
  children,
}: TwoColumnTextImageProps) => {
  const { t } = useI18n();

  const textColumn = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === "right" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`max-w-xl ${imagePosition === "left" ? "order-1 lg:order-2" : ""}`}
    >
      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
        {t(labelKey)}
      </span>
      <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">
        {t(titleKey)}
        {highlightKey && <span className="text-gradient-gold">{t(highlightKey)}</span>}
      </h2>
      {descriptions.map((descKey, i) => (
        <p
          key={descKey}
          className={`text-lg text-muted-foreground leading-relaxed ${i < descriptions.length - 1 ? "mb-6" : ""}`}
        >
          {t(descKey)}
        </p>
      ))}
    </motion.div>
  );

  const imageColumn = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative ${imagePosition === "left" ? "order-2 lg:order-1" : ""}`}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-80 lg:h-[28rem] object-cover"
          loading="lazy"
        />
      </div>
      {imagePosition === "right" ? (
        <>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/20 rounded-2xl -z-10" />
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-xl -z-10" />
        </>
      ) : (
        <>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-xl -z-10" />
        </>
      )}
      {children}
    </motion.div>
  );

  return (
    <section className={`py-20 lg:py-24 ${sectionBg || ""}`}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {textColumn}
          {imageColumn}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(TwoColumnTextImage);