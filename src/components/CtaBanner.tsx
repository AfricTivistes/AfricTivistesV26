import { withI18nMotion } from "@/lib/providers/withI18nMotion";
import { m as motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-shim";
import { useI18n } from "@/lib/i18n";

interface CtaBannerProps {
  titleKey: string;
  descKey: string;
  btnKey: string;
  linkTo: string;
  showDecoShapes?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

const CtaBanner = ({ titleKey, descKey, btnKey, linkTo, showDecoShapes = false, gradientFrom, gradientTo }: CtaBannerProps) => {
  const { t } = useI18n();

  return (
    <section className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          {gradientFrom && gradientTo ? (
            <>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} />
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 hero-gradient" />
          )}
          <div className="absolute inset-0 pattern-kente opacity-10" />
          {showDecoShapes && (
            <>
              <div className="absolute top-8 right-12 w-24 h-24 border border-white/10 rounded-full hidden lg:block" />
              <div className="absolute bottom-8 left-16 w-16 h-16 border border-white/20 rounded-xl rotate-45 hidden lg:block" />
            </>
          )}
          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t(titleKey)}
            </h2>
            <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {t(descKey)}
            </p>
            <Link
              to={linkTo}
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 border border-white/30 backdrop-blur-sm px-8 py-3.5 text-sm font-bold text-white hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
            >
              {t(btnKey)}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default withI18nMotion(CtaBanner);