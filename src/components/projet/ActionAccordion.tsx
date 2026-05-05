import { motion } from "framer-motion";

interface ActionAccordionProps {
  index: number;
  title: string;
  details: string[];
  seeDetailsLabel: string;
}

const ActionAccordion = ({ index, title, details }: ActionAccordionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-border rounded-2xl overflow-hidden bg-card"
    >
      <div className="flex items-start gap-4 p-5 lg:p-6">
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm lg:text-[15px] font-semibold text-foreground leading-snug">
          {title}
        </span>
      </div>

      {details.length > 0 && (
        <div className="px-5 lg:px-6 pb-5 lg:pb-6 pl-[4rem]">
          <ul className="space-y-2.5">
            {details.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ActionAccordion;
