import { useState, useEffect, useCallback } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryImage } from "@/lib/wordpress";

interface GalleryStripProps {
  images: GalleryImage[];
}

const GalleryStrip = ({ images }: GalleryStripProps) => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const goNext = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightbox((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, goNext, goPrev]);

  if (!images.length) return null;

  /* ---------- Layout adaptatif selon le nombre d'images ---------- */

  const gridClassMap: Record<number, string> = {
    1: "grid-cols-1 grid-rows-1 h-[280px] sm:h-[340px] lg:h-[420px]",
    2: "grid-cols-2 grid-rows-1 h-[240px] sm:h-[280px] lg:h-[340px]",
    3: "grid-cols-2 grid-rows-2 h-[240px] sm:h-[280px] lg:h-[340px]",
    4: "grid-cols-3 grid-rows-2 h-[240px] sm:h-[280px] lg:h-[340px]",
    5: "grid-cols-4 grid-rows-2 h-[240px] sm:h-[280px] lg:h-[340px]",
  };

  const spanClassMap: Record<number, string> = {
    1: "col-span-1 row-span-1",
    2: "col-span-1 row-span-1",
    3: "col-span-1 row-span-2",
    4: "col-span-1 row-span-2",
    5: "col-span-2 row-span-2",
  };

  const count = Math.min(images.length, 5);
  const gridClass = gridClassMap[count];
  const primarySpan = spanClassMap[count];

  return (
    <>
      <div className={`grid ${gridClass} gap-2 lg:gap-3 rounded-2xl overflow-hidden`}>
        {/* Image principale */}
        <motion.button
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => setLightbox(0)}
          className={`${primarySpan} relative group overflow-hidden cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary`}
        >
          <img
            src={images[0].url}
            alt={images[0].alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={14} />
            {images[0].alt}
          </div>
        </motion.button>

        {/* Images secondaires */}
        {images.slice(1, 5).map((img, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
            onClick={() => setLightbox(i + 1)}
            className="relative group overflow-hidden cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn size={18} className="text-white drop-shadow-lg" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.button
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-hidden"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </motion.button>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              src={images[lightbox].url}
              alt={images[lightbox].alt}
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === lightbox
                      ? "bg-white scale-125"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryStrip;
