import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarCardProps {
  title: string;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

const SidebarCard = ({ title, delay = 0, className, children }: SidebarCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={cn("bg-card rounded-2xl border border-border p-5 lg:p-6", className)}
  >
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
      {title}
    </h3>
    {children}
  </motion.div>
);

export default SidebarCard;
