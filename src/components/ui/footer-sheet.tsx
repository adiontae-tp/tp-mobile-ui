import * as React from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSheetManager } from "@/components/ui/sheet-manager";

const springConfig = {
  type: "spring" as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

/* ── Context ─────────────────────────────────────────────────────── */

interface FooterSheetContextValue {
  snapIndex: number;
  snapTo: (index: number) => void;
  snapCount: number;
}

const FooterSheetContext = React.createContext<FooterSheetContextValue>({
  snapIndex: 0,
  snapTo: () => {},
  snapCount: 0,
});

export const useFooterSheet = () => React.useContext(FooterSheetContext);

/* ── FooterSheet ─────────────────────────────────────────────────── */

interface FooterSheetProps {
  children: React.ReactNode;
  /** Whether the sheet is visible. */
  open: boolean;
  /** Called when the sheet wants to close (e.g. swiped down past the smallest snap). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Snap points as fractions of the container/viewport height (0–1).
   * Sorted ascending internally. The sheet always opens at ≥ 50%.
   * Example: [0.5, 0.85] — half screen, near full.
   */
  snapPoints?: number[];
  /** Index into the sorted snapPoints to start at when opened. Defaults to 0. */
  defaultSnapPoint?: number;
  /** Called when the sheet settles on a snap point index. */
  onSnapPointChange?: (index: number) => void;
  /** Portal target element. When provided, renders inside this container with absolute positioning. */
  container?: HTMLElement | null;
  className?: string;
}

function FooterSheet({
  children,
  open,
  onOpenChange,
  snapPoints,
  defaultSnapPoint = 0,
  onSnapPointChange,
  container,
  className,
}: FooterSheetProps) {
  const contained = container != null;
  const pos = contained ? "absolute" : "fixed";
  const sheetManager = useSheetManager();
  const sheetId = React.useId();

  // Register with global sheet manager
  React.useEffect(() => {
    if (open) {
      sheetManager?.request(sheetId, () => onOpenChange?.(false));
    } else {
      sheetManager?.release(sheetId);
    }
  }, [open, sheetId, sheetManager, onOpenChange]);

  // Resolve fractions to pixel heights based on container or viewport
  const getContainerHeight = React.useCallback(() => {
    if (container) return container.clientHeight;
    return window.innerHeight;
  }, [container]);

  // Default snap points: 50% and 85% if none provided
  const fractions = React.useMemo(
    () => {
      const pts = snapPoints ? [...snapPoints] : [0.5, 0.85];
      // Ensure at least 50%
      if (pts.every((p) => p < 0.5)) pts.push(0.5);
      return pts.sort((a, b) => a - b);
    },
    [snapPoints]
  );

  const [sorted, setSorted] = React.useState<number[]>(() =>
    fractions.map((f) => f * getContainerHeight())
  );

  // Recalculate on resize
  React.useEffect(() => {
    const update = () => setSorted(fractions.map((f) => f * getContainerHeight()));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [fractions, getContainerHeight]);

  const maxHeight = sorted[sorted.length - 1];
  const minHeight = sorted[0];
  const initialIndex = Math.min(defaultSnapPoint, sorted.length - 1);

  const [currentSnapIndex, setCurrentSnapIndex] = React.useState(initialIndex);
  const sheetHeight = useMotionValue(sorted[initialIndex]);

  // Reset to initial snap when opened
  React.useEffect(() => {
    if (open) {
      setCurrentSnapIndex(initialIndex);
      sheetHeight.set(sorted[initialIndex]);
    }
  }, [open, initialIndex, sheetHeight, sorted]);

  // Drag refs
  const dragStartY = React.useRef(0);
  const dragStartHeight = React.useRef(0);
  const isDragging = React.useRef(false);
  const lastVelocity = React.useRef(0);
  const lastY = React.useRef(0);
  const lastTime = React.useRef(0);

  const snapTo = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, sorted.length - 1));
      setCurrentSnapIndex(clamped);
      onSnapPointChange?.(clamped);
      animate(sheetHeight, sorted[clamped], springConfig);
    },
    [sheetHeight, onSnapPointChange, sorted]
  );

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartHeight.current = sheetHeight.get();
      lastY.current = e.clientY;
      lastTime.current = Date.now();
      lastVelocity.current = 0;
    },
    [sheetHeight]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const deltaY = dragStartY.current - e.clientY;
      const newHeight = Math.max(
        minHeight * 0.5,
        Math.min(maxHeight * 1.05, dragStartHeight.current + deltaY)
      );
      sheetHeight.set(newHeight);

      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        lastVelocity.current = ((lastY.current - e.clientY) / dt) * 1000;
      }
      lastY.current = e.clientY;
      lastTime.current = now;
    },
    [sheetHeight, minHeight, maxHeight]
  );

  const handlePointerUp = React.useCallback(
    (_e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const currentHeight = sheetHeight.get();
      const velocity = lastVelocity.current;

      // Dismiss if dragged well below the smallest snap or fast swipe down
      if (velocity < -400 || currentHeight < minHeight * 0.6) {
        onOpenChange?.(false);
        return;
      }

      // Find nearest snap
      let bestIndex = 0;
      let bestDist = Infinity;
      for (let i = 0; i < sorted.length; i++) {
        const dist = Math.abs(currentHeight - sorted[i]);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      // Velocity bias
      if (velocity > 300 && bestIndex < sorted.length - 1) {
        bestIndex++;
      } else if (velocity < -300 && bestIndex > 0) {
        bestIndex--;
      }

      snapTo(bestIndex);
    },
    [sheetHeight, sorted, snapTo, minHeight, onOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({ snapIndex: currentSnapIndex, snapTo, snapCount: sorted.length }),
    [currentSnapIndex, snapTo, sorted.length]
  );

  // Separate children by type
  let footer: React.ReactNode = null;
  let sheetContent: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === FooterSheetFooter) {
      footer = child;
    } else if (child.type === FooterSheetContent) {
      sheetContent = child;
    }
  });

  const sheetMarkup = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className={cn(pos, "inset-0 z-40 bg-black/40")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange?.(false)}
          />

          {/* Sheet */}
          <motion.div
            className={cn(
              pos,
              "inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-background shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
              "pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))]",
              className
            )}
            style={{ height: sheetHeight }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springConfig}
          >
            {/* Drag handle */}
            <div
              className="flex shrink-0 justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="h-[5px] w-9 rounded-full bg-muted-foreground/25" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {sheetContent}
            </div>

            {/* Footer — always visible inside the sheet */}
            {footer}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <FooterSheetContext.Provider value={contextValue}>
      {container ? createPortal(sheetMarkup, container) : sheetMarkup}
    </FooterSheetContext.Provider>
  );
}
FooterSheet.displayName = "FooterSheet";

/* ── FooterSheetContent ──────────────────────────────────────────── */

interface FooterSheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const FooterSheetContent = React.forwardRef<HTMLDivElement, FooterSheetContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pb-2", className)} {...props} />
  )
);
FooterSheetContent.displayName = "FooterSheetContent";

/* ── FooterSheetFooter ───────────────────────────────────────────── */

interface FooterSheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FooterSheetFooter = React.forwardRef<HTMLDivElement, FooterSheetFooterProps>(
  ({ className, children, ...props }, ref) => {
    const childCount = React.Children.count(children);

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 border-t border-border px-4 py-3",
          childCount === 1 ? "flex [&>*]:w-full" : "grid grid-cols-2 gap-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FooterSheetFooter.displayName = "FooterSheetFooter";

export { FooterSheet, FooterSheetContent, FooterSheetFooter };
