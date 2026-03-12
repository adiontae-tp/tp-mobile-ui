import * as React from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Types ────────────────────────────────────────────────────────── */

/**
 * A detent describes a resting height for the sheet.
 * - `number` — pixels (e.g. 120)
 * - `"50%"` — percentage of container/viewport height
 * - `"content"` — auto-sized to fit children (measured via ResizeObserver)
 */
type Detent = number | `${number}%` | "content";

/* ── Spring config ────────────────────────────────────────────────── */

const springConfig = {
  type: "spring" as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

/* ── Context ──────────────────────────────────────────────────────── */

interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  activeDetentIndex: number;
  setDetent: (index: number) => void;
  dismiss: () => void;
  dragControls: ReturnType<typeof useDragControls>;
  dragY: ReturnType<typeof useMotionValue<number>>;
  resolvedDetents: number[];
  sheetHeightPx: number;
  containerHeight: number;
  dismissible: boolean;
  container: HTMLElement | null | undefined;
  titleId: string;
  descriptionId: string;
}

const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(null);

/** Access sheet state and controls from any child. */
function useBottomSheet() {
  const ctx = React.useContext(BottomSheetContext);
  if (!ctx) throw new Error("useBottomSheet must be used within a <BottomSheet>");
  return {
    open: ctx.open,
    activeDetent: ctx.activeDetentIndex,
    setDetent: ctx.setDetent,
    dismiss: ctx.dismiss,
  };
}

/* ── Helpers ──────────────────────────────────────────────────────── */

function parseDetent(d: Detent, containerHeight: number, contentHeight: number): number {
  if (d === "content") return contentHeight;
  if (typeof d === "number") return d;
  // percentage string like "50%"
  const pct = parseFloat(d) / 100;
  return pct * containerHeight;
}

function resolveDetents(
  detents: Detent[],
  containerHeight: number,
  contentHeight: number
): number[] {
  return detents
    .map((d) => parseDetent(d, containerHeight, contentHeight))
    .sort((a, b) => a - b);
}

/* ── Root ─────────────────────────────────────────────────────────── */

interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  /** When false, no overlay and content behind remains interactive. @default true */
  modal?: boolean;
  /** Snap detents. @default ["90%"] */
  detents?: Detent[];
  /** Controlled active detent index (into sorted detents). */
  activeDetent?: number;
  /** Initial detent index. @default last (largest) */
  defaultDetent?: number;
  /** Called when the sheet settles on a detent. */
  onDetentChange?: (index: number) => void;
  /** Whether the sheet can be dismissed by dragging down. @default true */
  dismissible?: boolean;
  /** Portal target. When provided, renders inside this container with absolute positioning. */
  container?: HTMLElement | null;
  children: React.ReactNode;
}

function BottomSheet({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  modal = true,
  detents: detentsProp = ["90%"],
  activeDetent: activeDetentProp,
  defaultDetent,
  onDetentChange,
  dismissible = true,
  container,
  children,
}: BottomSheetProps) {
  // Open state
  const isControlledOpen = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlledOpen ? openProp : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlledOpen) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlledOpen, onOpenChange]
  );

  // Detent state
  const isControlledDetent = activeDetentProp !== undefined;
  const initialDetentIndex = defaultDetent ?? detentsProp.length - 1;
  const [internalDetentIndex, setInternalDetentIndex] = React.useState(initialDetentIndex);
  const activeDetentIndex = isControlledDetent ? activeDetentProp : internalDetentIndex;

  // Drag
  const dragControls = useDragControls();
  const dragY = useMotionValue(0);

  // Content measurement for "content" detent
  const [contentHeight, setContentHeight] = React.useState(300);

  // Container/viewport height
  const getContainerHeight = React.useCallback(() => {
    if (container) return container.clientHeight;
    return typeof window !== "undefined" ? window.innerHeight : 800;
  }, [container]);

  const [containerHeight, setContainerHeight] = React.useState(getContainerHeight);

  React.useEffect(() => {
    const update = () => setContainerHeight(getContainerHeight());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getContainerHeight]);

  // Resolve detents to px
  const resolvedDetents = React.useMemo(
    () => resolveDetents(detentsProp, containerHeight, contentHeight),
    [detentsProp, containerHeight, contentHeight]
  );

  const maxDetentPx = resolvedDetents[resolvedDetents.length - 1];

  // The sheet is always full container height so it extends to the bottom edge.
  // Y-offset controls how much is visible: y = containerHeight - detentPx.
  const sheetHeightPx = containerHeight;

  const getYForDetent = React.useCallback(
    (index: number) => {
      const detentPx = resolvedDetents[index] ?? maxDetentPx;
      return containerHeight - detentPx;
    },
    [resolvedDetents, maxDetentPx, containerHeight]
  );

  const setDetent = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, resolvedDetents.length - 1));
      if (!isControlledDetent) setInternalDetentIndex(clamped);
      onDetentChange?.(clamped);
      animate(dragY, getYForDetent(clamped), springConfig);
    },
    [resolvedDetents.length, isControlledDetent, onDetentChange, dragY, getYForDetent]
  );

  const dismiss = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      const idx = isControlledDetent ? activeDetentProp : initialDetentIndex;
      const clampedIdx = Math.max(0, Math.min(idx, resolvedDetents.length - 1));
      if (!isControlledDetent) setInternalDetentIndex(clampedIdx);
      dragY.set(getYForDetent(clampedIdx));
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync controlled detent
  React.useEffect(() => {
    if (isControlledDetent && isOpen) {
      animate(dragY, getYForDetent(activeDetentProp), springConfig);
    }
  }, [activeDetentProp]); // eslint-disable-line react-hooks/exhaustive-deps

  // IDs for aria
  const instanceId = React.useId();
  const titleId = `sheet-title-${instanceId}`;
  const descriptionId = `sheet-desc-${instanceId}`;

  const ctxValue = React.useMemo<BottomSheetContextValue>(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
      modal,
      activeDetentIndex,
      setDetent,
      dismiss,
      dragControls,
      dragY,
      resolvedDetents,
      sheetHeightPx,
      containerHeight,
      dismissible,
      container,
      titleId,
      descriptionId,
    }),
    [
      isOpen,
      handleOpenChange,
      modal,
      activeDetentIndex,
      setDetent,
      dismiss,
      dragControls,
      dragY,
      resolvedDetents,
      sheetHeightPx,
      containerHeight,
      dismissible,
      container,
      titleId,
      descriptionId,
    ]
  );

  return (
    <BottomSheetContext.Provider value={ctxValue}>
      <ContentMeasurer
        detents={detentsProp}
        onMeasure={setContentHeight}
      />
      {children}
    </BottomSheetContext.Provider>
  );
}

/** Invisible element to measure content height when "content" detent is used. */
function ContentMeasurer({
  detents,
  onMeasure,
}: {
  detents: Detent[];
  onMeasure: (h: number) => void;
}) {
  // Only set up observer if "content" detent is in use
  const hasContent = detents.includes("content");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hasContent || !ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onMeasure(entry.contentRect.height);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasContent, onMeasure]);

  // We don't render a measurer — content measurement happens on the scroll area
  return null;
}

/* ── Trigger ──────────────────────────────────────────────────────── */

interface BottomSheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const BottomSheetTrigger = React.forwardRef<HTMLButtonElement, BottomSheetTriggerProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const ctx = React.useContext(BottomSheetContext);
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        ctx?.onOpenChange(true);
        onClick?.(e);
      },
      [ctx, onClick]
    );
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} onClick={handleClick} {...props} />;
  }
);
BottomSheetTrigger.displayName = "BottomSheetTrigger";

/* ── Close ────────────────────────────────────────────────────────── */

interface BottomSheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const BottomSheetClose = React.forwardRef<HTMLButtonElement, BottomSheetCloseProps>(
  ({ asChild, onClick, ...props }, ref) => {
    const ctx = React.useContext(BottomSheetContext);
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        ctx?.dismiss();
        onClick?.(e);
      },
      [ctx, onClick]
    );
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} onClick={handleClick} {...props} />;
  }
);
BottomSheetClose.displayName = "BottomSheetClose";

/* ── Content ──────────────────────────────────────────────────────── */

interface BottomSheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @deprecated Use `onOpenChange` on the root `<BottomSheet>` instead. */
  onClose?: () => void;
}

const BottomSheetContent = React.forwardRef<HTMLDivElement, BottomSheetContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    const ctx = React.useContext(BottomSheetContext);
    if (!ctx) return null;

    const {
      open,
      onOpenChange,
      modal,
      dragControls,
      dragY,
      resolvedDetents,
      sheetHeightPx,
      containerHeight,
      dismissible,
      container,
      titleId,
      descriptionId,
      activeDetentIndex,
    } = ctx;

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const contained = container != null;
    const position = contained ? "absolute" : "fixed";

    // Overlay opacity: fully opaque at largest detent, transparent when dismissed
    const largestDetentY = containerHeight - (resolvedDetents[resolvedDetents.length - 1] ?? containerHeight);
    const overlayOpacity = useTransform(dragY, [largestDetentY, containerHeight], [1, 0]);

    // Y offset for current detent
    const getYForDetent = React.useCallback(
      (index: number) => {
        const detentPx = resolvedDetents[index] ?? resolvedDetents[resolvedDetents.length - 1];
        return containerHeight - detentPx;
      },
      [resolvedDetents, containerHeight]
    );

    const initialY = getYForDetent(activeDetentIndex);

    const handleDismiss = React.useCallback(() => {
      onOpenChange(false);
      onClose?.();
    }, [onOpenChange, onClose]);

    // Drag end: snap to nearest detent or dismiss
    const handleDragEnd = React.useCallback(
      (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const currentY = dragY.get();
        const velocityY = info.velocity.y;

        // Dismiss check
        if (dismissible) {
          const smallestDetentPx = resolvedDetents[0];
          const dismissThresholdY = containerHeight - smallestDetentPx * 0.5;

          if (velocityY > 400 || currentY > dismissThresholdY) {
            handleDismiss();
            return;
          }
        }

        // Find nearest detent
        let bestIndex = 0;
        let bestDist = Infinity;
        for (let i = 0; i < resolvedDetents.length; i++) {
          const snapY = getYForDetent(i);
          const dist = Math.abs(currentY - snapY);
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
          }
        }

        // Velocity bias
        if (velocityY < -200 && bestIndex < resolvedDetents.length - 1) {
          bestIndex = Math.min(bestIndex + 1, resolvedDetents.length - 1);
        } else if (velocityY > 200 && bestIndex > 0) {
          bestIndex = Math.max(bestIndex - 1, 0);
        }

        ctx.setDetent(bestIndex);
      },
      [dragY, dismissible, resolvedDetents, containerHeight, getYForDetent, handleDismiss, ctx]
    );

    // Drag/scroll handoff: block sheet drag when scrolled down
    const handleContentPointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        const el = scrollRef.current;
        if (el && el.scrollTop > 0) {
          e.stopPropagation();
        }
      },
      []
    );

    // Prevent iOS overscroll chaining on the scroll content
    React.useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      let startY = 0;

      const onTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
      };

      const onTouchMove = (e: TouchEvent) => {
        const dy = e.touches[0].clientY - startY;
        if (el.scrollTop <= 0 && dy > 0) {
          e.preventDefault();
        }
        if (el.scrollTop + el.clientHeight >= el.scrollHeight && dy < 0) {
          e.preventDefault();
        }
      };

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      return () => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
      };
    }, [open]);

    // Escape key dismissal
    React.useEffect(() => {
      if (!open || !modal) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleDismiss();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, modal, handleDismiss]);

    // Body scroll lock for modal sheets (not contained)
    React.useEffect(() => {
      if (!open || !modal || contained) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open, modal, contained]);

    const portalTarget = contained ? container! : document.body;

    const sheet = (
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            {modal && (
              <motion.div
                key="bs-overlay"
                className={cn(
                  "inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
                  position
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ opacity: overlayOpacity }}
                onClick={dismissible ? handleDismiss : undefined}
              />
            )}

            {/* Sheet */}
            <motion.div
              key="bs-sheet"
              ref={ref}
              role="dialog"
              aria-modal={modal}
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className={cn(
                "inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-background shadow-[0_-8px_32px_rgba(0,0,0,0.12)] touch-none",
                position,
                className
              )}
              style={{
                height: sheetHeightPx,
                maxHeight: contained ? "100%" : "100dvh",
                y: dragY,
                willChange: "transform",
                paddingBottom: contained
                  ? undefined
                  : "var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))",
              }}
              initial={{ y: sheetHeightPx }}
              animate={{ y: initialY }}
              exit={{ y: sheetHeightPx }}
              transition={springConfig}
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: -15 }}
              dragElastic={{ top: 0.08, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              onPointerDown={(e) => dragControls.start(e)}
              {...props}
            >
              {/* Drag handle */}
              <div
                className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="h-[5px] w-9 rounded-full bg-muted-foreground/25" />
              </div>

              {/* Scrollable content with drag/scroll handoff */}
              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 touch-auto"
                onPointerDown={handleContentPointerDown}
              >
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );

    return createPortal(sheet, portalTarget);
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
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(BottomSheetContext);
  return (
    <h2
      ref={ref}
      id={ctx?.titleId}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
});
BottomSheetTitle.displayName = "BottomSheetTitle";

const BottomSheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(BottomSheetContext);
  return (
    <p
      ref={ref}
      id={ctx?.descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
BottomSheetDescription.displayName = "BottomSheetDescription";

/* ── Exports ──────────────────────────────────────────────────────── */

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  useBottomSheet,
  type Detent,
  type BottomSheetProps,
  type BottomSheetContentProps,
};
