import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SharedElementProps {
  /** Unique ID that matches between source and destination screens */
  id: string;
  children: React.ReactNode;
  className?: string;
}

function SharedElement({ id, children, className }: SharedElementProps) {
  return (
    <motion.div
      layoutId={id}
      className={cn("inline-block", className)}
      transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

SharedElement.displayName = "SharedElement";

export { SharedElement };
