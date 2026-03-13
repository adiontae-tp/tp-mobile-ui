import * as React from "react";
import { motion, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/* ── Types ────────────────────────────────────────────────────────── */

export interface TimeValue {
  hours: number;
  minutes: number;
  /** Only used in 12-hour mode. */
  period?: "AM" | "PM";
}

type TimeFormat = "12h" | "24h";

/* ── Helpers ──────────────────────────────────────────────────────── */

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

function padZero(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatTimeValue(value: TimeValue, format: TimeFormat): string {
  if (format === "12h") {
    const h = value.hours === 0 ? 12 : value.hours > 12 ? value.hours - 12 : value.hours;
    return `${h}:${padZero(value.minutes)} ${value.period ?? "AM"}`;
  }
  return `${padZero(value.hours)}:${padZero(value.minutes)}`;
}

function to24Hour(value: TimeValue): TimeValue {
  if (!value.period) return value;
  let hours = value.hours;
  if (value.period === "AM" && hours === 12) hours = 0;
  if (value.period === "PM" && hours !== 12) hours += 12;
  return { hours, minutes: value.minutes };
}

function to12Hour(hours24: number): { hours: number; period: "AM" | "PM" } {
  const period: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  let hours = hours24 % 12;
  if (hours === 0) hours = 12;
  return { hours, period };
}

/* ── Scroll Wheel ────────────────────────────────────────────────── */

interface WheelColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

function WheelColumn({ items, selectedIndex, onSelect, className }: WheelColumnProps) {
  const y = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Target y for a given index
  const targetY = (index: number) => -index * ITEM_HEIGHT;

  // Snap to selected index on mount and when selectedIndex changes
  React.useEffect(() => {
    controls.set({ y: targetY(selectedIndex) });
  }, [selectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const snapToNearest = React.useCallback(
    (currentY: number, velocity: number) => {
      // Predict final position with velocity
      const projected = currentY + velocity * 0.15;
      let index = Math.round(-projected / ITEM_HEIGHT);
      index = Math.max(0, Math.min(index, items.length - 1));
      onSelect(index);
      controls.start({
        y: targetY(index),
        transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8 },
      });
    },
    [items.length, onSelect, controls] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      snapToNearest(y.get(), info.velocity.y);
    },
    [snapToNearest, y]
  );

  // Click to select
  const handleItemClick = React.useCallback(
    (index: number) => {
      onSelect(index);
      controls.start({
        y: targetY(index),
        transition: { type: "spring", damping: 30, stiffness: 300, mass: 0.8 },
      });
    },
    [onSelect, controls] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
    >
      {/* Selection highlight band */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 rounded-lg bg-accent/50"
        style={{
          top: CENTER_INDEX * ITEM_HEIGHT,
          height: ITEM_HEIGHT,
        }}
      />

      {/* Fade gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-background to-transparent" />

      {/* Draggable column */}
      <motion.div
        drag="y"
        dragConstraints={{
          top: targetY(items.length - 1),
          bottom: 0,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ y }}
        animate={controls}
        className="cursor-grab active:cursor-grabbing"
      >
        {/* Top padding so first item can be centered */}
        <div style={{ height: CENTER_INDEX * ITEM_HEIGHT }} />

        {items.map((item, i) => (
          <button
            key={`${item}-${i}`}
            type="button"
            onClick={() => handleItemClick(i)}
            className={cn(
              "flex w-full items-center justify-center text-lg tabular-nums transition-colors",
              i === selectedIndex
                ? "font-semibold text-foreground"
                : "font-normal text-muted-foreground"
            )}
            style={{ height: ITEM_HEIGHT }}
          >
            {item}
          </button>
        ))}

        {/* Bottom padding so last item can be centered */}
        <div style={{ height: CENTER_INDEX * ITEM_HEIGHT }} />
      </motion.div>
    </div>
  );
}

/* ── TimePicker Inline ───────────────────────────────────────────── */

interface TimePickerWheelsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled value. */
  value?: TimeValue;
  /** Uncontrolled default. */
  defaultValue?: TimeValue;
  /** Fires on change. */
  onChange?: (value: TimeValue) => void;
  /** 12-hour or 24-hour format. @default "12h" */
  format?: TimeFormat;
  /** Minute step. @default 1 */
  minuteStep?: number;
}

const TimePickerWheels = React.forwardRef<HTMLDivElement, TimePickerWheelsProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      format = "12h",
      minuteStep = 1,
      className,
      ...props
    },
    ref
  ) => {
    const is12h = format === "12h";

    const defaultVal = defaultValue ?? { hours: 12, minutes: 0, period: "AM" as const };
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<TimeValue>(defaultVal);
    const value = isControlled ? valueProp : internalValue;

    const update = React.useCallback(
      (next: TimeValue) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    // Build item lists
    const hourItems = React.useMemo(() => {
      if (is12h) {
        return Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
      }
      return Array.from({ length: 24 }, (_, i) => padZero(i));
    }, [is12h]);

    const minuteItems = React.useMemo(() => {
      const items: string[] = [];
      for (let m = 0; m < 60; m += minuteStep) {
        items.push(padZero(m));
      }
      return items;
    }, [minuteStep]);

    const periodItems = ["AM", "PM"];

    // Indices
    const hourIndex = is12h
      ? (value.hours === 0 ? 12 : value.hours > 12 ? value.hours - 12 : value.hours) - 1
      : value.hours;

    // For 12h mode: index 0 = 12, index 1 = 1, ..., index 11 = 11
    // Special case: if hours is 0 (midnight), show as 12 AM → index 11... no:
    // hourItems = ["12", "1", "2", ..., "11"]
    // hours=12 → index 0, hours=1 → index 1, ..., hours=11 → index 11
    // hours=0 (midnight in 24h passed as 12h) → treated as 12 AM → index 0
    const computedHourIndex = is12h
      ? (() => {
          const h = value.hours % 12; // 0-11
          return h === 0 ? 0 : h; // 0→0 (which is "12"), 1→1, ..., 11→11
        })()
      : value.hours;

    const minuteIndex = Math.round(value.minutes / minuteStep);
    const periodIndex = (value.period ?? "AM") === "AM" ? 0 : 1;

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-0", className)}
        {...props}
      >
        {/* Hours */}
        <WheelColumn
          items={hourItems}
          selectedIndex={computedHourIndex}
          onSelect={(i) => {
            let hours: number;
            if (is12h) {
              hours = i === 0 ? 12 : i; // index 0 → 12, index 1 → 1, etc.
            } else {
              hours = i;
            }
            update({ ...value, hours });
          }}
          className="w-16"
        />

        {/* Separator */}
        <span className="text-lg font-semibold text-foreground">:</span>

        {/* Minutes */}
        <WheelColumn
          items={minuteItems}
          selectedIndex={minuteIndex}
          onSelect={(i) => {
            update({ ...value, minutes: i * minuteStep });
          }}
          className="w-16"
        />

        {/* AM/PM (12h only) */}
        {is12h && (
          <WheelColumn
            items={periodItems}
            selectedIndex={periodIndex}
            onSelect={(i) => {
              update({ ...value, period: i === 0 ? "AM" : "PM" });
            }}
            className="ml-2 w-14"
          />
        )}
      </div>
    );
  }
);
TimePickerWheels.displayName = "TimePickerWheels";

/* ── TimePicker (Modal) ──────────────────────────────────────────── */

interface TimePickerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Controlled value. */
  value?: TimeValue;
  /** Uncontrolled default. */
  defaultValue?: TimeValue;
  /** Fires when the user confirms a selection. */
  onConfirm?: (value: TimeValue) => void;
  /** 12-hour or 24-hour format. @default "12h" */
  format?: TimeFormat;
  /** Minute step. @default 1 */
  minuteStep?: number;
  /** Sheet header title. */
  title?: string;
  /** Confirm button label. @default "Done" */
  confirmLabel?: string;
  /** Clear button label. @default "Clear" */
  clearLabel?: string;
  /** Portal target. */
  container?: HTMLElement | null;
  children: React.ReactNode;
}

function TimePicker({
  open,
  onOpenChange,
  value,
  defaultValue,
  onConfirm,
  format = "12h",
  minuteStep = 1,
  title,
  confirmLabel = "Done",
  clearLabel = "Clear",
  container,
  children,
}: TimePickerProps) {
  const defaultVal = defaultValue ?? value ?? { hours: 12, minutes: 0, period: "AM" as const };
  const [pendingValue, setPendingValue] = React.useState<TimeValue>(defaultVal);

  // Reset pending value when sheet opens
  React.useEffect(() => {
    if (open) {
      setPendingValue(value ?? defaultVal);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const dismiss = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const handleConfirm = React.useCallback(() => {
    onConfirm?.(pendingValue);
    dismiss();
  }, [pendingValue, onConfirm, dismiss]);

  const handleClear = React.useCallback(() => {
    onConfirm?.({ hours: 0, minutes: 0, period: "AM" });
    dismiss();
  }, [onConfirm, dismiss]);

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleOpenChange}
      modal
      container={container}
      detents={["content"]}
    >
      {children && (
        <BottomSheetTrigger asChild>
          {React.Children.only(children)}
        </BottomSheetTrigger>
      )}

      <BottomSheetContent>
        {title && (
          <BottomSheetHeader>
            <BottomSheetTitle>{title}</BottomSheetTitle>
          </BottomSheetHeader>
        )}

        <TimePickerWheels
          value={pendingValue}
          onChange={setPendingValue}
          format={format}
          minuteStep={minuteStep}
          className="py-2"
        />

        <Separator className="my-2" />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex min-h-touch flex-1 items-center justify-center rounded-xl text-sm font-semibold text-muted-foreground transition-colors active:bg-accent"
          >
            {clearLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex min-h-touch flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors active:opacity-80"
          >
            {confirmLabel}
          </button>
        </div>
        <div className="h-2" />
      </BottomSheetContent>
    </BottomSheet>
  );
}
TimePicker.displayName = "TimePicker";

/* ── Trigger (re-export) ─────────────────────────────────────────── */

const TimePickerTrigger = BottomSheetTrigger;
TimePickerTrigger.displayName = "TimePickerTrigger";

/* ── Exports ──────────────────────────────────────────────────────── */

export {
  TimePicker,
  TimePickerTrigger,
  TimePickerWheels,
  formatTimeValue,
  to24Hour,
  to12Hour,
  type TimeValue,
  type TimeFormat,
  type TimePickerProps,
  type TimePickerWheelsProps,
};
