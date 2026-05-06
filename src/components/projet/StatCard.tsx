import { m as motion } from "framer-motion";

interface StatCardProps {
  emoji: string;
  value: string;
  label: string;
  delay?: number;
  href?: string;
}

const StatCard = ({ emoji, value, label, delay = 0, href }: StatCardProps) => {
  const content = (
    <>
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/8 mb-2.5 group-hover:bg-primary/12 transition-colors">
        <span className="text-lg leading-none">{emoji}</span>
      </div>
      <span className="text-xl lg:text-2xl font-bold font-heading text-foreground tabular-nums leading-none">{value}</span>
      <span className="text-[10px] text-muted-foreground font-semibold mt-1.5 uppercase tracking-widest leading-tight">{label}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="group flex flex-col items-center text-center p-4 lg:p-5 bg-card rounded-2xl border border-border hover:border-primary/20 transition-all hover:shadow-md cursor-pointer"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group flex flex-col items-center text-center p-4 lg:p-5 bg-card rounded-2xl border border-border hover:border-primary/20 transition-all hover:shadow-md"
    >
      {content}
    </motion.div>
  );
};

export default StatCard;
