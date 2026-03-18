import * as React from "react";
import { createPortal } from "react-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSheetManager } from "@/components/ui/sheet-manager";

/* ── Context ─────────────────────────────────────────────────────── */

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: "left" | "right";
  mode: "slide" | "push";
  width: string;
}

const DrawerContext = React.createContext<DrawerContextValue>({
  open: false,
  onOpenChange: () => {},
  side: "left",
  mode: "slide",
  width: "280px",
});

/* ── Root ─────────────────────────────────────────────────────────── */

interface DrawerProps extends DialogPrimitive.DialogProps {
  /** Which edge the drawer slides from. @default "left" */
  side?: "left" | "right";
  /** "slide" overlays the drawer on top; "push" shifts the page content. @default "slide" */
  mode?: "slide" | "push";
  /** Drawer panel width. Any CSS value. @default "280px" */
  width?: string;
}

function Drawer({
  open,
  onOpenChange,
  side = "left",
  mode = "slide",
  width = "280px",
  children,
  ...props
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(props.defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const sheetManager = useSheetManager();
  const sheetId = React.useId();

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Register with global sheet manager
  React.useEffect(() => {
    if (isOpen) {
      sheetManager?.request(sheetId, () => handleOpenChange(false));
    } else {
      sheetManager?.release(sheetId);
    }
  }, [isOpen, sheetId, sheetManager, handleOpenChange]);

  return (
    <DrawerContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange, side, mode, width }}
    >
      <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} modal={false} {...props}>
        {children}
      </DialogPrimitive.Root>
    </DrawerContext.Provider>
  );
}

const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

const enterSpring = {
  type: "spring" as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

const exitTween = {
  duration: 0.2,
  ease: [0.32, 0, 0.67, 0] as const,
};

/* ── Content ─────────────────────────────────────────────────────── */

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  onClose?: () => void;
  /** Portal target element. When provided, the drawer renders inside this container with absolute positioning. */
  container?: HTMLElement | null;
}

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, onClose, container, ...props }, ref) => {
  const { open, onOpenChange, side, mode, width } = React.useContext(DrawerContext);

  const dismiss = React.useCallback(() => {
    onOpenChange(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  const isLeft = side === "left";
  const contained = container != null;
  const isPush = mode === "push";

  /* Contained: React portal into container (no Radix body side effects) */
  if (contained) {
    return createPortal(
      <AnimatePresence>
        {open && (
          <>
            {!isPush && (
              <motion.div
                key="overlay"
                className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={dismiss}
              />
            )}
            <motion.div
              key="sheet"
              ref={ref as React.Ref<HTMLDivElement>}
              role="dialog"
              className={cn(
                "absolute inset-y-0 z-50 flex flex-col bg-background shadow-[0_0_24px_rgba(0,0,0,0.12)]",
                isLeft ? "left-0" : "right-0",
                className
              )}
              style={{ width, maxWidth: "85vw", willChange: "transform" }}
              initial={{ x: isLeft ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isLeft ? "-100%" : "100%" }}
              transition={enterSpring}
            >
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      container!
    );
  }

  /* Default: Radix portal for full-page usage */
  return (
    <AnimatePresence>
      {open && (
        <DrawerPortal forceMount>
          {!isPush && (
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={dismiss}
              />
            </DialogPrimitive.Overlay>
          )}
          <DialogPrimitive.Content
            ref={ref}
            asChild
            forceMount
            onEscapeKeyDown={dismiss}
            onPointerDownOutside={dismiss}
            {...props}
          >
            <motion.div
              className={cn(
                "fixed inset-y-0 z-50 flex flex-col bg-background shadow-[0_0_24px_rgba(0,0,0,0.12)]",
                isLeft ? "left-0" : "right-0",
                className
              )}
              style={{ width, maxWidth: "85vw", willChange: "transform" }}
              initial={{ x: isLeft ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isLeft ? "-100%" : "100%" }}
              transition={enterSpring}
            >
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </motion.div>
          </DialogPrimitive.Content>
        </DrawerPortal>
      )}
    </AnimatePresence>
  );
});
DrawerContent.displayName = "DrawerContent";

/* ── Body (for push mode) ────────────────────────────────────────── */

interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Wrap your main page content in `DrawerBody` when using `mode="push"`.
 * It translates the content aside when the drawer opens.
 */
const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ className, style, ...props }, ref) => {
    const { open, side, mode, width } = React.useContext(DrawerContext);
    const isPush = mode === "push";

    const translateX = React.useMemo(() => {
      if (!isPush || !open) return "0px";
      return side === "left" ? width : `-${width}`;
    }, [isPush, open, side, width]);

    return (
      <motion.div
        ref={ref}
        className={cn("flex-1", className)}
        style={style}
        animate={{ x: translateX }}
        transition={enterSpring}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
      />
    );
  }
);
DrawerBody.displayName = "DrawerBody";

/* ── Header / Title / Description ────────────────────────────────── */

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-4 pb-2", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

/* ── Footer ──────────────────────────────────────────────────────── */

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 p-4 pt-2 pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))]", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
};
