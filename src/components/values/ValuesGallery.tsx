import { withDataProviders } from "@/lib/withProviders";
import { motion } from "framer-motion";

const galleryItems = [
  { src: "https://update.africtivistes.org/wp-content/uploads/2023/11/IMG_1642-2-1-scaled.jpg", span: "md:col-span-2 md:row-span-2" },
  { src: "https://citizenlabbenin.org/_astro/formation1.bc0f03e8_daRtv.webp", span: "" },
  { src: "https://update.africtivistes.org/wp-content/uploads/2025/11/image.jpeg", span: "" },
  { src: "https://update.africtivistes.org/wp-content/uploads/2026/02/Ucad-Senegal.jpg", span: "md:col-span-2" },
];

const ValuesGallery = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {galleryItems.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-xl overflow-hidden group ${img.span}`}
            >
              <img
                src={img.src}
                alt=""
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                  i === 0 ? "h-48 md:h-full" : "h-48 md:h-56"
                }`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default withDataProviders(ValuesGallery);