import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Context to pass open state from Root to Content ──────────────── */

interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BottomSheetContext = React.createContext<BottomSheetContextValue>({
  open: false,
  onOpenChange: () => {},
});

/* ── Root wrapper ─────────────────────────────────────────────────── */

interface BottomSheetProps extends DialogPrimitive.DialogProps {}

function BottomSheet({ open, onOpenChange, children, ...props }: BottomSheetProps) {
  // For uncontrolled usage, track internal state
  const [internalOpen, setInternalOpen] = React.useState(props.defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <BottomSheetContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </DialogPrimitive.Root>
    </BottomSheetContext.Provider>
  );
}

const BottomSheetTrigger = DialogPrimitive.Trigger;
const BottomSheetClose = DialogPrimitive.Close;
const BottomSheetPortal = DialogPrimitive.Portal;

const springConfig = {
  type: "spring" as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

/* ── Content ──────────────────────────────────────────────────────── */

interface BottomSheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  onClose?: () => void;
  /** Snap points as fractions of viewport height, e.g. [0.25, 0.5, 0.85]. Sorted ascending internally. */
  snapPoints?: number[];
  /** Index into the (sorted) snapPoints array to open at. Defaults to the last (largest) snap point. */
  defaultSnapPoint?: number;
  /** Called when the sheet settles on a snap point (index into sorted array). */
  onSnapPointChange?: (index: number) => void;
}

const BottomSheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  BottomSheetContentProps
>(
  (
    {
      className,
      children,
      onClose,
      snapPoints: snapPointsProp,
      defaultSnapPoint,
      onSnapPointChange,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange } = React.useContext(BottomSheetContext);
    const dragControls = useDragControls();
    const dragY = useMotionValue(0);

    // Sort snap points ascending
    const sorted = React.useMemo(
      () => (snapPointsProp ? [...snapPointsProp].sort((a, b) => a - b) : null),
      [snapPointsProp]
    );

    const hasSnaps = sorted !== null && sorted.length > 0;
    const maxSnap = hasSnaps ? sorted[sorted.length - 1] : 0.85;

    // The initial snap index (default = largest)
    const initialIndex = hasSnaps
      ? (defaultSnapPoint !== undefined
          ? Math.min(defaultSnapPoint, sorted.length - 1)
          : sorted.length - 1)
      : 0;

    const [currentSnapIndex, setCurrentSnapIndex] = React.useState(initialIndex);

    // Reset snap index when sheet opens
    React.useEffect(() => {
      if (open) {
        setCurrentSnapIndex(initialIndex);
        dragY.set(0);
      }
    }, [open, initialIndex, dragY]);

    // Convert snap fractions to y-offsets (px from the fully-open position).
    const getYForSnap = React.useCallback(
      (index: number) => {
        if (!hasSnaps) return 0;
        const vh = window.innerHeight;
        const maxHeight = maxSnap * vh;
        const targetHeight = sorted![index] * vh;
        return maxHeight - targetHeight;
      },
      [hasSnaps, sorted, maxSnap]
    );

    // Overlay opacity tracks drag position
    const maxSheetPx = maxSnap * (typeof window !== "undefined" ? window.innerHeight : 800);
    const overlayOpacity = useTransform(dragY, [0, maxSheetPx], [1, 0]);

    const dismiss = React.useCallback(() => {
      onOpenChange(false);
      onClose?.();
    }, [onOpenChange, onClose]);

    const snapTo = React.useCallback(
      (index: number) => {
        setCurrentSnapIndex(index);
        onSnapPointChange?.(index);
        animate(dragY, getYForSnap(index), springConfig);
      },
      [dragY, getYForSnap, onSnapPointChange]
    );

    const handleDragEnd = React.useCallback(
      (
        _event: MouseEvent | TouchEvent | PointerEvent,
        info: { velocity: { y: number }; offset: { y: number } }
      ) => {
        if (!hasSnaps) {
          if (info.velocity.y > 200 || info.offset.y > 120) {
            dismiss();
          } else {
            animate(dragY, 0, springConfig);
          }
          return;
        }

        const vh = window.innerHeight;
        const maxHeight = maxSnap * vh;
        const currentY = dragY.get();

        // If fast swipe down or dragged past the smallest snap, dismiss
        const smallestSnapHeight = sorted![0] * vh;
        const dismissThresholdY = maxHeight - smallestSnapHeight * 0.5;

        if (info.velocity.y > 400 || currentY > dismissThresholdY) {
          dismiss();
          return;
        }

        // Find the nearest snap point
        let bestIndex = 0;
        let bestDist = Infinity;
        for (let i = 0; i < sorted!.length; i++) {
          const snapY = getYForSnap(i);
          const dist = Math.abs(currentY - snapY);
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
          }
        }

        // Velocity bias: if swiping up, prefer the next larger snap; if down, next smaller
        if (info.velocity.y < -200 && bestIndex < sorted!.length - 1) {
          bestIndex = Math.min(bestIndex + 1, sorted!.length - 1);
        } else if (info.velocity.y > 200 && bestIndex > 0) {
          bestIndex = Math.max(bestIndex - 1, 0);
        }

        snapTo(bestIndex);
      },
      [hasSnaps, dismiss, dragY, maxSnap, sorted, getYForSnap, snapTo]
    );

    // Set initial y for the starting snap point
    const initialY = hasSnaps ? getYForSnap(initialIndex) : 0;

    return (
      <AnimatePresence>
        {open && (
          <BottomSheetPortal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ opacity: overlayOpacity }}
              />
            </DialogPrimitive.Overlay>
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
                  "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-background pb-safe-bottom shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
                  className
                )}
                style={{
                  height: hasSnaps ? `${maxSnap * 100}dvh` : undefined,
                  maxHeight: hasSnaps ? undefined : "85dvh",
                  y: dragY,
                }}
                initial={{ y: "100%" }}
                animate={{ y: initialY }}
                exit={{ y: "100%" }}
                transition={springConfig}
                drag="y"
                dragControls={dragControls}
                dragConstraints={{ top: hasSnaps ? -10 : 0 }}
                dragElastic={{ top: 0.05, bottom: 0.6 }}
                onDragEnd={handleDragEnd}
              >
                {/* Drag handle */}
                <div
                  className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <div className="h-[5px] w-9 rounded-full bg-muted-foreground/25" />
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </BottomSheetPortal>
        )}
      </AnimatePresence>
    );
  }
);
BottomSheetContent.displayName = "BottomSheetContent";

/* ── Header / Title / Description ─────────────────────────────────── */

const BottomSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
);
BottomSheetHeader.displayName = "BottomSheetHeader";

const BottomSheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

const BottomSheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
BottomSheetDescription.displayName = "BottomSheetDescription";

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
};
