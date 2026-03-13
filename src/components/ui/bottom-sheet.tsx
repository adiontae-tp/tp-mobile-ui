import * as React from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/* ── Types ────────────────────────────────────────────────────────── */

/**
 * A detent describes a resting height for the sheet.
 * - `number` — pixels (e.g. 120)
 * - `"50%"` — percentage of container/viewport height
 * - `"content"` — auto-sized to fit children
 */
type Detent = number | `${number}%` | "content";

/* ── Context ──────────────────────────────────────────────────────── */

interface BottomSheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  activeDetentIndex: number;
  setDetent: (index: number) => void;
  /** Update detent state without calling snapTo (avoids feedback loop with onSnap). */
  setDetentState: (index: number) => void;
  dismiss: () => void;
  sheetRef: React.RefObject<SheetRef | null>;
  detents: Detent[];
  resolvedSnapPoints: number[];
  defaultDetentIndex: number;
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

function parseDetent(d: Detent, containerHeight: number): number {
  if (d === "content") return 0; // react-modal-sheet handles content detent differently
  if (typeof d === "number") return d;
  const pct = parseFloat(d) / 100;
  return Math.round(pct * containerHeight);
}

/* ── Root ─────────────────────────────────────────────────────────── */

interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  /** When false, no overlay and content behind remains interactive. @default true */
  modal?: boolean;
  /** Snap detents. @default ["25%", "50%", "90%"] */
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
  detents: detentsProp = ["25%", "50%", "90%"],
  activeDetent: activeDetentProp,
  defaultDetent,
  onDetentChange,
  dismissible = true,
  container,
  children,
}: BottomSheetProps) {
  const sheetRef = React.useRef<SheetRef>(null);

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
  const defaultDetentIndex = defaultDetent ?? detentsProp.length - 1;
  const [internalDetentIndex, setInternalDetentIndex] = React.useState(defaultDetentIndex);
  const activeDetentIndex = isControlledDetent ? activeDetentProp : internalDetentIndex;

  // Container height for resolving percentages
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

  // Resolve detents to pixel heights, sorted ascending (smallest first)
  const resolvedHeights = React.useMemo(() => {
    const hasContent = detentsProp.includes("content");
    if (hasContent) return [];
    return detentsProp
      .map((d) => parseDetent(d, containerHeight))
      .sort((a, b) => a - b);
  }, [detentsProp, containerHeight]);

  // react-modal-sheet snapPoints: distances from TOP, sorted ascending
  // (smallest distance = tallest sheet, largest distance = shortest sheet)
  const resolvedSnapPoints = React.useMemo(() => {
    if (resolvedHeights.length === 0) return [];
    // Reverse so tallest (largest height) comes first as smallest distance from top
    return [...resolvedHeights].reverse().map((h) => containerHeight - h);
  }, [resolvedHeights, containerHeight]);

  // Our detent index (ascending by height) ↔ snap index (ascending by distance from top)
  // detent 0 = smallest height = largest distance from top = last snap index
  const toSheetSnapIndex = React.useCallback(
    (detentIdx: number) => resolvedSnapPoints.length - 1 - detentIdx,
    [resolvedSnapPoints.length]
  );

  const fromSheetSnapIndex = React.useCallback(
    (snapIdx: number) => resolvedSnapPoints.length - 1 - snapIdx,
    [resolvedSnapPoints.length]
  );

  // setDetent: only updates state, does NOT call snapTo (avoids feedback loop with onSnap)
  const setDetentState = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, detentsProp.length - 1));
      if (!isControlledDetent) setInternalDetentIndex(clamped);
      onDetentChange?.(clamped);
    },
    [detentsProp.length, isControlledDetent, onDetentChange]
  );

  // setDetent: updates state AND programmatically snaps
  const setDetent = React.useCallback(
    (index: number) => {
      setDetentState(index);
      const clamped = Math.max(0, Math.min(index, detentsProp.length - 1));
      sheetRef.current?.snapTo(toSheetSnapIndex(clamped));
    },
    [setDetentState, detentsProp.length, toSheetSnapIndex]
  );

  const dismiss = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      const idx = isControlledDetent ? activeDetentProp : defaultDetentIndex;
      const clamped = Math.max(0, Math.min(idx, detentsProp.length - 1));
      if (!isControlledDetent) setInternalDetentIndex(clamped);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync controlled detent
  React.useEffect(() => {
    if (isControlledDetent && isOpen) {
      sheetRef.current?.snapTo(toSheetSnapIndex(activeDetentProp));
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
      setDetentState,
      dismiss,
      sheetRef,
      detents: detentsProp,
      resolvedSnapPoints,
      defaultDetentIndex,
      dismissible,
      container,
      titleId,
      descriptionId,
    }),
    [
      isOpen, handleOpenChange, modal, activeDetentIndex, setDetent, setDetentState,
      dismiss, detentsProp, resolvedSnapPoints, defaultDetentIndex,
      dismissible, container, titleId, descriptionId,
    ]
  );

  return (
    <BottomSheetContext.Provider value={ctxValue}>
      {children}
    </BottomSheetContext.Provider>
  );
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
      sheetRef,
      resolvedSnapPoints,
      defaultDetentIndex,
      dismissible,
      container,
      titleId,
      descriptionId,
    } = ctx;

    const handleClose = React.useCallback(() => {
      onOpenChange(false);
      onClose?.();
    }, [onOpenChange, onClose]);

    // Handle snap index changes from react-modal-sheet (state only, no snapTo feedback loop)
    const handleSnap = React.useCallback(
      (snapIndex: number) => {
        const detentIdx = resolvedSnapPoints.length - 1 - snapIndex;
        ctx.setDetentState(detentIdx);
      },
      [resolvedSnapPoints.length, ctx]
    );

    // Determine detent for react-modal-sheet
    const hasContent = ctx.detents.includes("content");
    const detent = hasContent ? "content" : "default";

    // Initial snap index (convert our ascending index to react-modal-sheet descending)
    const initialSnap = resolvedSnapPoints.length > 0
      ? resolvedSnapPoints.length - 1 - defaultDetentIndex
      : 0;

    return (
      <Sheet
        ref={sheetRef}
        isOpen={open}
        onClose={handleClose}
        snapPoints={resolvedSnapPoints.length > 0 ? resolvedSnapPoints : undefined}
        initialSnap={resolvedSnapPoints.length > 0 ? Math.max(0, Math.min(initialSnap, resolvedSnapPoints.length - 1)) : 0}
        onSnap={resolvedSnapPoints.length > 0 ? handleSnap : undefined}
        detent={resolvedSnapPoints.length > 0 ? undefined : detent}
        mountPoint={container ?? undefined}
        disableDrag={false}
        disableDismiss={!dismissible}
      >
        <Sheet.Container
          className={cn(
            "!rounded-t-2xl !bg-background !shadow-[0_-8px_32px_rgba(0,0,0,0.12)]",
            className
          )}
          style={{
            paddingBottom: container
              ? undefined
              : "var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))",
          }}
          {...props}
        >
          <Sheet.Header className="!bg-transparent" />
          <Sheet.Content>
            <div
              ref={ref}
              role="dialog"
              aria-modal={modal}
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className="px-4 pb-4"
            >
              {children}
            </div>
          </Sheet.Content>
        </Sheet.Container>
        {modal && <Sheet.Backdrop />}
      </Sheet>
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
