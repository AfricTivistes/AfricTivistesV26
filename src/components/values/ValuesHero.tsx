import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const ValuesHero = () => {
  return (
    <PageHero
      backgroundImage="https://citizenlabbenin.org/_astro/formation1.bc0f03e8_daRtv.webp"
      labelKey="nav.about.values"
      titleKey="values.title"
      subtitleKey="values.subtitle"
      gradient="bg-gradient-to-br from-primary/95 via-primary/80 to-[hsl(37,70%,30%)]/80"
      patternOpacity="opacity-15"
      verticalPadding="py-12 lg:py-16"
    >
      <div className="absolute top-20 right-[15%] w-32 h-32 border-2 border-secondary/20 rounded-full hidden lg:block animate-float" />
      <div className="absolute bottom-16 left-[10%] w-20 h-20 border border-white/10 rounded-xl rotate-12 hidden lg:block" />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "5rem" }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="h-1 bg-secondary rounded-full mt-8"
      />
    </PageHero>
  );
};

export default withDataProviders(ValuesHero);