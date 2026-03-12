import * as React from "react";
import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Spring config matching Apple's UIKit spring ─────────────────── */

const springConfig = {
  type: "spring" as const,
  damping: 32,
  stiffness: 380,
  mass: 0.8,
};

/* ── Types ────────────────────────────────────────────────────────── */

type SnapPoint = "peek" | "half" | "full";

interface ToolbarSheetContextValue {
  snap: SnapPoint;
  snapTo: (point: SnapPoint) => void;
  progress: ReturnType<typeof useMotionValue<number>>;
  /** Opacity 0→1 that fades in content below the toolbar bar as the sheet expands. */
  contentOpacity: ReturnType<typeof useMotionValue<number>>;
  /** Start a drag from any child element. */
  startDrag: (e: React.PointerEvent) => void;
}

const ToolbarSheetContext = React.createContext<ToolbarSheetContextValue | null>(null);

/** Access the current snap state and control the sheet programmatically. */
function useToolbarSheet() {
  const ctx = React.useContext(ToolbarSheetContext);
  if (!ctx) throw new Error("useToolbarSheet must be used within a <ToolbarSheet>");
  return ctx;
}

/* ── Helpers ──────────────────────────────────────────────────────── */

/** Convert a snap point name to a height in pixels. */
function snapToHeight(
  point: SnapPoint,
  peekHeight: number,
  halfHeight: number,
  fullHeight: number
) {
  switch (point) {
    case "peek":
      return peekHeight;
    case "half":
      return halfHeight;
    case "full":
      return fullHeight;
  }
}

/** Map a height to the corresponding snap label. */
function heightToSnap(
  height: number,
  peekHeight: number,
  halfHeight: number,
  fullHeight: number
): SnapPoint {
  const dPeek = Math.abs(height - peekHeight);
  const dHalf = Math.abs(height - halfHeight);
  const dFull = Math.abs(height - fullHeight);
  if (dPeek <= dHalf && dPeek <= dFull) return "peek";
  if (dHalf <= dFull) return "half";
  return "full";
}

/* ── Root ─────────────────────────────────────────────────────────── */

interface ToolbarSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Height (in px) of the collapsed "peek" toolbar state.
   * Includes the drag handle area. Default: 96
   */
  peekHeight?: number;
  /**
   * Height of the "half" detent as a fraction of viewport height (0–1).
   * Default: 0.45
   */
  halfDetent?: number;
  /**
   * Height of the "full" detent as a fraction of viewport height (0–1).
   * Default: 0.92
   */
  fullDetent?: number;
  /** The snap point the sheet opens at. Default: "peek" */
  defaultSnap?: SnapPoint;
  /** Controlled snap point. */
  snap?: SnapPoint;
  /** Called when the sheet settles on a snap point. */
  onSnapChange?: (snap: SnapPoint) => void;
}

function ToolbarSheet({
  peekHeight = 96,
  halfDetent = 0.45,
  fullDetent = 0.92,
  defaultSnap = "peek",
  snap: snapProp,
  onSnapChange,
  className,
  children,
  ...props
}: ToolbarSheetProps) {
  const isControlled = snapProp !== undefined;
  const [internalSnap, setInternalSnap] = React.useState<SnapPoint>(defaultSnap);
  const currentSnap = isControlled ? snapProp : internalSnap;

  const dragControls = useDragControls();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Motion value: represents the **height** of the sheet in px
  const sheetHeight = useMotionValue(peekHeight);

  // Measure the nearest positioned ancestor (or viewport) for detent calculations
  const getContainerHeight = React.useCallback(() => {
    const el = containerRef.current;
    if (el?.offsetParent && el.offsetParent !== document.body) {
      return (el.offsetParent as HTMLElement).clientHeight;
    }
    return typeof window !== "undefined" ? window.innerHeight : 800;
  }, []);

  // Progress 0→1 from peek→full (used by consumers for parallax, etc.)
  const initialCh = typeof window !== "undefined" ? window.innerHeight : 800;
  const progress = useTransform(sheetHeight, [peekHeight, fullDetent * initialCh], [0, 1]);

  // Content opacity: fades in over the first ~30% of travel from peek → half
  const fadeEnd = peekHeight + (halfDetent * initialCh - peekHeight) * 0.3;
  const contentOpacity = useTransform(sheetHeight, [peekHeight, fadeEnd], [0, 1]);

  // Keep heights fresh on resize / layout changes
  const heights = React.useRef({ peek: peekHeight, half: halfDetent * initialCh, full: fullDetent * initialCh });

  const recalcHeights = React.useCallback(() => {
    const ch = getContainerHeight();
    heights.current = {
      peek: peekHeight,
      half: halfDetent * ch,
      full: fullDetent * ch,
    };
  }, [peekHeight, halfDetent, fullDetent, getContainerHeight]);

  React.useEffect(() => {
    recalcHeights();
    window.addEventListener("resize", recalcHeights);
    return () => window.removeEventListener("resize", recalcHeights);
  }, [recalcHeights]);

  // Re-measure once mounted (container may not have been laid out during first render)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    if (mounted) {
      recalcHeights();
      const h = heights.current;
      sheetHeight.set(snapToHeight(defaultSnap, h.peek, h.half, h.full));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Animate to a snap point
  const animateTo = React.useCallback(
    (point: SnapPoint) => {
      recalcHeights();
      const h = heights.current;
      const target = snapToHeight(point, h.peek, h.half, h.full);
      animate(sheetHeight, target, springConfig);
      if (!isControlled) setInternalSnap(point);
      onSnapChange?.(point);
    },
    [sheetHeight, isControlled, onSnapChange, recalcHeights]
  );

  // Sync controlled prop
  React.useEffect(() => {
    if (isControlled && snapProp) animateTo(snapProp);
  }, [snapProp, isControlled, animateTo]);

  // Drag handling — we drag in the y-axis but convert to height changes
  const dragStartHeight = React.useRef(0);

  const handleDragStart = React.useCallback(() => {
    recalcHeights();
    dragStartHeight.current = sheetHeight.get();
  }, [sheetHeight, recalcHeights]);

  const handleDrag = React.useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const h = heights.current;
      // Dragging up (negative offset.y) should increase height
      const newHeight = dragStartHeight.current - info.offset.y;
      // Clamp with rubber-band at edges
      const clamped = Math.max(h.peek * 0.7, Math.min(h.full * 1.04, newHeight));
      sheetHeight.set(clamped);
    },
    [sheetHeight]
  );

  const handleDragEnd = React.useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const h = heights.current;
      const currentHeight = sheetHeight.get();
      const velocityY = info.velocity.y;

      // Velocity-biased snap: if swiping fast, prefer direction
      let target: SnapPoint;
      if (velocityY < -400) {
        // Fast swipe up → go to next larger snap
        if (currentHeight < h.half) target = "half";
        else target = "full";
      } else if (velocityY > 400) {
        // Fast swipe down → go to next smaller snap
        if (currentHeight > h.half) target = "half";
        else target = "peek";
      } else {
        // Proximity-based
        target = heightToSnap(currentHeight, h.peek, h.half, h.full);
      }

      animateTo(target);
    },
    [sheetHeight, animateTo]
  );

  const startDrag = React.useCallback(
    (e: React.PointerEvent) => dragControls.start(e),
    [dragControls]
  );

  const ctxValue = React.useMemo<ToolbarSheetContextValue>(
    () => ({ snap: currentSnap, snapTo: animateTo, progress, contentOpacity, startDrag }),
    [currentSnap, animateTo, progress, contentOpacity, startDrag]
  );

  return (
    <ToolbarSheetContext.Provider value={ctxValue}>
      <motion.div
        ref={containerRef}
        className={cn(
          "absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-2xl bg-background/85 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-safe-bottom touch-none",
          className
        )}
        style={{
          height: sheetHeight,
          willChange: "height",
        }}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        dragMomentum={false}
        dragListener={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onPointerDown={(e) => dragControls.start(e)}
        {...props}
      >
        {/* Drag handle */}
        <div className="flex flex-col items-center pt-1.5 pb-0.5 select-none">
          <div className="h-[5px] w-9 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Sheet content (toolbar + expandable area) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </div>
      </motion.div>
    </ToolbarSheetContext.Provider>
  );
}
ToolbarSheet.displayName = "ToolbarSheet";

/* ── Toolbar (always visible in peek state) ──────────────────────── */

interface ToolbarSheetBarProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToolbarSheetBar = React.forwardRef<HTMLDivElement, ToolbarSheetBarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center gap-2 px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ToolbarSheetBar.displayName = "ToolbarSheetBar";

/* ── Toolbar action button ───────────────────────────────────────── */

interface ToolbarSheetActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element. */
  icon?: React.ReactNode;
  /** Optional label displayed below or beside the icon. */
  label?: string;
  /** Visual variant. */
  variant?: "default" | "primary" | "destructive" | "muted";
}

const toolbarActionVariants: Record<string, string> = {
  default:
    "bg-secondary text-secondary-foreground active:bg-secondary/70",
  primary:
    "bg-primary text-primary-foreground active:bg-primary/80",
  destructive:
    "bg-destructive text-destructive-foreground active:bg-destructive/80",
  muted:
    "bg-muted text-muted-foreground active:bg-muted/70",
};

const ToolbarSheetAction = React.forwardRef<
  HTMLButtonElement,
  ToolbarSheetActionProps
>(({ icon, label, variant = "default", className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex min-h-touch items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
      toolbarActionVariants[variant],
      className
    )}
    {...props}
  >
    {icon && (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
    )}
    {label && <span>{label}</span>}
    {children}
  </button>
));
ToolbarSheetAction.displayName = "ToolbarSheetAction";

/* ── Expandable content (visible at half / full) ─────────────────── */

interface ToolbarSheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToolbarSheetContent = React.forwardRef<
  HTMLDivElement,
  ToolbarSheetContentProps
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(ToolbarSheetContext);
  const innerRef = React.useRef<HTMLDivElement>(null);

  // Allow native scrolling when content is scrolled down; otherwise let the
  // sheet's drag take over. We stop propagation of pointerdown when the
  // scroll container has scrollable content that isn't at the top.
  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (el && el.scrollTop > 0) {
        e.stopPropagation();
      }
    },
    []
  );

  // Prevent iOS pull-to-refresh when scrolled to top and pulling down.
  // touchmove at scrollTop=0 with downward direction would chain to the
  // browser's overscroll — we block it here so the sheet drag handles it.
  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - startY;
      // Pulling down while already at the top — block browser overscroll
      if (el.scrollTop <= 0 && dy > 0) {
        e.preventDefault();
      }
      // Pulling up while already at the bottom — block browser overscroll
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
  }, []);

  return (
    <motion.div
      ref={(node) => {
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-1 pb-4 touch-auto",
        className
      )}
      style={{ opacity: ctx?.contentOpacity }}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {children}
    </motion.div>
  );
});
ToolbarSheetContent.displayName = "ToolbarSheetContent";

/* ── Info row (e.g. "14 min · 6.2 mi · Fastest Route") ──────────── */

interface ToolbarSheetInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToolbarSheetInfo = React.forwardRef<HTMLDivElement, ToolbarSheetInfoProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(ToolbarSheetContext);
    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex shrink-0 items-center gap-1.5 px-4 py-1.5 text-xs text-muted-foreground",
          className
        )}
        style={{ opacity: ctx?.contentOpacity }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
ToolbarSheetInfo.displayName = "ToolbarSheetInfo";

/* ── Separator ───────────────────────────────────────────────────── */

function ToolbarSheetSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(ToolbarSheetContext);
  return (
    <motion.div
      className={cn("mx-4 h-px shrink-0 bg-border", className)}
      style={{ opacity: ctx?.contentOpacity }}
      {...props}
    />
  );
}
ToolbarSheetSeparator.displayName = "ToolbarSheetSeparator";

/* ── Exports ─────────────────────────────────────────────────────── */

export {
  ToolbarSheet,
  ToolbarSheetBar,
  ToolbarSheetAction,
  ToolbarSheetContent,
  ToolbarSheetInfo,
  ToolbarSheetSeparator,
  useToolbarSheet,
  type SnapPoint,
  type ToolbarSheetProps,
};
