import { withI18nMotion } from "@/lib/providers/withI18nMotion";
import { m as motion, AnimatePresence } from "framer-motion";
import { useI18n, type Lang } from "@/lib/i18n";
import { useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";

interface Testimonial {
  id: number;
  name: string;
  role: Record<Lang, string>;
  country: string;
  image: string;
  quote: Record<Lang, string>;
}

const testimonials: Testimonial[] = (testimonialsData as { items: Testimonial[] }).items;

/* Group testimonials in pairs of 2 */
const ITEMS_PER_SLIDE = 2;
const slides: Testimonial[][] = [];
for (let i = 0; i < testimonials.length; i += ITEMS_PER_SLIDE) {
  slides.push(testimonials.slice(i, i + ITEMS_PER_SLIDE));
}

const TestimonialCard = ({ item, lang, onHover }: { item: Testimonial; lang: Lang; onHover?: (paused: boolean) => void }) => (
  <div
    className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-8 flex flex-col h-full transition-shadow duration-300 cursor-pointer hover:shadow-xl"
    onMouseEnter={() => onHover?.(true)}
    onMouseLeave={() => onHover?.(false)}
  >
    {/* Author photo + info header */}
    <div className="flex items-center gap-4 mb-6">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shrink-0"
        loading="lazy"
        decoding="async"
        width="64"
        height="64"
      />
      <div className="min-w-0">
        <p className="font-heading font-bold text-foreground truncate">
          {item.name}
        </p>
        <p className="text-sm text-muted-foreground leading-snug">
          {item.role[lang]}
        </p>
        <p className="text-xs text-primary font-medium mt-0.5">
          {item.country}
        </p>
      </div>
    </div>

    {/* Quote */}
    <div className="flex-1 relative">
      <Quote size={20} className="text-primary/20 absolute -top-1 -left-1" aria-hidden="true" />
      <blockquote className="pl-6">
        <p className="text-[15px] sm:text-base leading-relaxed text-foreground/85 italic">
          {item.quote[lang]}
        </p>
      </blockquote>
    </div>
  </div>
);

const Testimonials = () => {
  const { t, lang } = useI18n();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  /* Auto-advance every 7s, pause when hovering */
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const currentSlide = slides[current];

  return (
    <section
      className="relative py-12 lg:py-16 bg-muted/30 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pattern-african opacity-40" aria-hidden="true" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/8 rounded-full blur-[100px]" aria-hidden="true" />

      <div className="relative section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3 border border-primary/15 backdrop-blur-sm">
            {t("testimonials.label")}
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl lg:text-4xl font-bold text-foreground"
          >
            {t("testimonials.title")}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            {t("testimonials.subtitle")}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent mx-auto mt-4 rounded-full" aria-hidden="true" />
        </motion.div>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative min-h-[420px] sm:min-h-[320px] lg:min-h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                role="list"
              >
                {currentSlide.map((item) => (
                  <div key={item.id} role="listitem">
                    <TestimonialCard item={item} lang={lang} onHover={setIsPaused} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={lang === "fr" ? "Témoignages précédents" : "Previous testimonials"}
            >
              <ChevronLeft size={18} className="text-foreground/70" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label={lang === "fr" ? "Navigation des témoignages" : "Testimonials navigation"}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`${lang === "fr" ? "Témoignages" : "Testimonials"} ${i * ITEMS_PER_SLIDE + 1}-${Math.min((i + 1) * ITEMS_PER_SLIDE, testimonials.length)}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-foreground/15 hover:bg-foreground/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={lang === "fr" ? "Témoignages suivants" : "Next testimonials"}
            >
              <ChevronRight size={18} className="text-foreground/70" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default withI18nMotion(Testimonials);
