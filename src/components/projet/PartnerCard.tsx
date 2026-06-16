import { useState } from "react";
import { m as motion } from "framer-motion";
import type { PartnerOrg } from "@/lib/wordpress";

interface PartnerLogoProps {
  org: PartnerOrg;
  index: number;
}

const PartnerLogo = ({ org, index }: PartnerLogoProps) => {
  const [failed, setFailed] = useState(false);
  const initials = org.name
    .split(" ")
    .filter((w) => w.length > 2 || org.name.split(" ").length <= 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.a
      href={org.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 + index * 0.04, type: "spring", stiffness: 200 }}
      className="group/logo relative flex items-center justify-center"
      title={org.name}
    >
      <div className="w-20 h-20 rounded-xl bg-white dark:bg-card flex items-center justify-center overflow-hidden border border-border/60 shadow-xs group-hover/logo:shadow-md group-hover/logo:border-primary/30 group-hover/logo:scale-105 transition-all duration-200">
        {failed || !org.logo ? (
          <span className="text-xs font-bold text-primary/70">{initials}</span>
        ) : (
          <img
            src={org.logo}
            alt={org.name}
            className="w-14 h-14 object-contain grayscale group-hover/logo:grayscale-0 transition-all duration-300"
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
            width="56"
            height="56"
          />
        )}
      </div>
    </motion.a>
  );
};

interface PartnerCardProps {
  title: string;
  orgs: PartnerOrg[];
  delay?: number;
}

const PartnerCard = ({ title, orgs, delay = 0 }: PartnerCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
  >
    <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3 text-center lg:text-left">
      {title}
    </h3>
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
      {orgs.map((org, i) => (
        <PartnerLogo key={org.name} org={org} index={i} />
      ))}
    </div>
  </motion.div>
);

export default PartnerCard;
