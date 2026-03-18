import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";

const thumbSpring = { damping: 22, stiffness: 400, mass: 0.6 };

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
  const controlled = checked !== undefined;
  const on = controlled ? checked : isChecked;

  const handleChange = (val: boolean) => {
    if (!controlled) setIsChecked(val);
    onCheckedChange?.(val);
  };

  const x = useSpring(on ? 20 : 0, thumbSpring);
  const scaleX = useTransform(x, [0, 10, 20], [1, 1.15, 1]);

  React.useEffect(() => {
    x.set(on ? 20 : 0);
  }, [on, x]);

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      checked={on}
      onCheckedChange={handleChange}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb asChild>
        <motion.span
          className="pointer-events-none block h-6 w-6 rounded-full bg-background shadow-lg ring-0"
          style={{ x, scaleX }}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = "Switch";

export { Switch };
