import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";

const galleryImages = [
  { src: "https://citizenlabbenin.org/_astro/formation1.bc0f03e8_daRtv.webp", alt: "Engagement citoyen" },
  { src: "https://update.africtivistes.org/wp-content/uploads/2025/11/image.jpeg", alt: "Voix panafricaine" },
  { src: "https://update.africtivistes.org/wp-content/uploads/2023/11/IMG_1642-2-1-scaled.jpg", alt: "Innovation numérique" },
];

const AboutGallery = () => {
  return (
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
  );
};

export default withDataProviders(AboutGallery);