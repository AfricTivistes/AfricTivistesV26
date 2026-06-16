import { m as motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import { type WPPlateforme, getPlateformeImageUrl, stripHtml } from "@/lib/wordpress";

interface PlatformGridProps {
  platforms: WPPlateforme[];
}

const PlatformGrid = ({ platforms }: PlatformGridProps) => {
  if (platforms.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {platforms.map((platform, i) => {
        const imageUrl = getPlateformeImageUrl(platform);
        const title = stripHtml(platform.title.rendered);
        const url = platform.acf?.url || "#";
        const domain = url !== "#" ? new URL(url).hostname.replace("www.", "") : "";

        return (
          <motion.a
            key={platform.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group flex items-center gap-4 bg-card rounded-xl border border-border p-4 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 duration-300"
          >
            {/* Thumbnail ou icone */}
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/60">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="48"
                />
              ) : (
                <Globe size={20} className="text-muted-foreground" />
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-card-foreground leading-tight group-hover:text-primary transition-colors truncate font-heading">
                {title}
              </h3>
              {domain && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {domain}
                </p>
              )}
            </div>

            {/* Fleche */}
            <ExternalLink
              size={14}
              className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
            />
          </motion.a>
        );
      })}
    </div>
  );
};

export default PlatformGrid;
