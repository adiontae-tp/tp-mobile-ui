import * as React from "react";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
} from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const staggerContainer = {
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 22, stiffness: 300 } },
};

const tapSpring = { type: "spring" as const, damping: 18, stiffness: 400, mass: 0.5 };

export interface ActionSheetAction {
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
}

export interface ActionSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions: ActionSheetAction[];
  cancelLabel?: string;
  children?: React.ReactNode;
  /** Portal target element for contained rendering. */
  container?: HTMLElement | null;
}

function ActionSheet({
  open,
  onOpenChange,
  actions,
  cancelLabel = "Cancel",
  children,
  container,
}: ActionSheetProps) {
  const handleAction = (action: ActionSheetAction) => {
    action.onSelect();
    onOpenChange?.(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} modal={!container} container={container} detents={["content"]}>
      {children && <BottomSheetTrigger asChild>{children}</BottomSheetTrigger>}
      <BottomSheetContent>
        <motion.div
          className="flex flex-col"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Separator />}
              <motion.button
                variants={itemVariant}
                whileTap={{ scale: 0.97 }}
                transition={tapSpring}
                className={cn(
                  "flex min-h-touch w-full items-center gap-3 px-2 py-3 text-base font-medium transition-colors active:bg-accent rounded-md",
                  action.destructive && "text-destructive"
                )}
                onClick={() => handleAction(action)}
              >
                {action.icon && (
                  <span className="flex h-5 w-5 items-center justify-center">
                    {action.icon}
                  </span>
                )}
                {action.label}
              </motion.button>
            </React.Fragment>
          ))}
        </motion.div>
        <Separator className="my-2" />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.15 }}
          whileTap={{ scale: 0.97 }}
          className="flex min-h-touch w-full items-center justify-center rounded-md py-3 text-base font-semibold text-muted-foreground active:bg-accent"
          onClick={() => onOpenChange?.(false)}
        >
          {cancelLabel}
        </motion.button>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export { ActionSheet };
