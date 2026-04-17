import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description: string;
  className?: string;
}

const PageHeader = ({ title, description, className }: PageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </motion.div>
  );
};

export default PageHeader;
