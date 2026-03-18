import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const checkSpring = { type: "spring" as const, damping: 18, stiffness: 400, mass: 0.5 };

const CheckIcon = () => (
  <motion.svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={checkSpring}
  >
    <motion.path
      d="M2.5 7.5L5.5 10.5L11.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
    />
  </motion.svg>
);

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, onCheckedChange, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState<
    boolean | "indeterminate"
  >(props.checked ?? props.defaultChecked ?? false);

  const isChecked = props.checked !== undefined ? props.checked : internalChecked;

  const handleChange = (val: boolean | "indeterminate") => {
    if (props.checked === undefined) setInternalChecked(val);
    onCheckedChange?.(val);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-6 w-6 shrink-0 rounded-md border border-primary ring-offset-background transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      onCheckedChange={handleChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
        forceMount
      >
        <AnimatePresence>
          {isChecked === true && <CheckIcon key="check" />}
        </AnimatePresence>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
