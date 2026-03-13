import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────── */

export interface DateRange {
  from: Date;
  to?: Date;
}

type SelectionMode = "single" | "range" | "multiple";

type SelectedValue<M extends SelectionMode> = M extends "single"
  ? Date | undefined
  : M extends "range"
    ? DateRange | undefined
    : Date[];

type OnSelectCallback<M extends SelectionMode> = M extends "single"
  ? (date: Date | undefined) => void
  : M extends "range"
    ? (range: DateRange | undefined) => void
    : (dates: Date[]) => void;

/* ── Helpers ──────────────────────────────────────────────────────── */

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function addMonths(date: Date, count: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + count);
  return d;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

/** Build the 6×7 grid of dates for the given month. */
function getMonthGrid(month: Date, weekStartsOn: number): (Date | null)[] {
  const first = startOfMonth(month);
  const daysInMonth = getDaysInMonth(month);
  const startDay = (first.getDay() - weekStartsOn + 7) % 7;
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < startDay || i >= startDay + daysInMonth) {
      cells.push(null);
    } else {
      cells.push(new Date(first.getFullYear(), first.getMonth(), i - startDay + 1));
    }
  }
  return cells;
}

function getOrderedDayLabels(weekStartsOn: number): string[] {
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    labels.push(DAY_LABELS[(i + weekStartsOn) % 7]);
  }
  return labels;
}

/* ── Context ──────────────────────────────────────────────────────── */

interface CalendarContextValue {
  month: Date;
  changeMonth: (direction: 1 | -1) => void;
  jumpToMonth: (date: Date) => void;
  mode: SelectionMode;
  selected: Date | undefined | DateRange | undefined | Date[];
  handleDayClick: (day: Date) => void;
  isDateDisabled: (date: Date) => boolean;
  weekStartsOn: number;
}

const CalendarContext = React.createContext<CalendarContextValue>({
  month: startOfMonth(new Date()),
  changeMonth: () => {},
  jumpToMonth: () => {},
  mode: "single",
  selected: undefined,
  handleDayClick: () => {},
  isDateDisabled: () => false,
  weekStartsOn: 0,
});

/* ── Root ──────────────────────────────────────────────────────────── */

interface CalendarBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled displayed month. */
  month?: Date;
  /** Initial month (uncontrolled). */
  defaultMonth?: Date;
  /** Fires when the displayed month changes. */
  onMonthChange?: (date: Date) => void;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
  /** Disabled dates — array or predicate. */
  disabled?: Date[] | ((date: Date) => boolean);
  /** First day of week (0=Sun, 1=Mon, …). @default 0 */
  weekStartsOn?: number;
}

interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single";
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  selected?: DateRange;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

interface CalendarMultipleProps extends CalendarBaseProps {
  mode: "multiple";
  selected?: Date[];
  defaultSelected?: Date[];
  onSelect?: (dates: Date[]) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps | CalendarMultipleProps;

function Calendar({
  mode = "single",
  selected: selectedProp,
  defaultSelected,
  onSelect,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabled,
  weekStartsOn = 0,
  className,
  children,
  ...props
}: CalendarProps) {
  // Month navigation state
  const initialMonth = defaultMonth
    ?? (mode === "single" && (selectedProp as Date | undefined))
    ?? (mode === "range" && (selectedProp as DateRange | undefined)?.from)
    ?? (mode === "multiple" && (selectedProp as Date[] | undefined)?.[0])
    ?? new Date();

  const isControlledMonth = monthProp !== undefined;
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(initialMonth instanceof Date ? initialMonth : new Date())
  );
  const month = isControlledMonth ? startOfMonth(monthProp) : internalMonth;

  const changeMonth = React.useCallback(
    (direction: 1 | -1) => {
      const next = startOfMonth(addMonths(month, direction));
      if (!isControlledMonth) setInternalMonth(next);
      onMonthChange?.(next);
    },
    [month, isControlledMonth, onMonthChange]
  );

  const jumpToMonth = React.useCallback(
    (date: Date) => {
      const target = startOfMonth(date);
      if (!isControlledMonth) setInternalMonth(target);
      onMonthChange?.(target);
    },
    [isControlledMonth, onMonthChange]
  );

  // Selection state
  const isControlledSelected = selectedProp !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<
    Date | undefined | DateRange | undefined | Date[]
  >(defaultSelected);

  const selected = isControlledSelected ? selectedProp : internalSelected;

  const updateSelected = React.useCallback(
    (value: Date | undefined | DateRange | undefined | Date[]) => {
      if (!isControlledSelected) setInternalSelected(value);
      (onSelect as ((v: unknown) => void) | undefined)?.(value);
    },
    [isControlledSelected, onSelect]
  );

  // Disable check
  const isDateDisabled = React.useCallback(
    (date: Date): boolean => {
      const d = startOfDay(date);
      if (min && isBefore(d, startOfDay(min))) return true;
      if (max && isBefore(startOfDay(max), d)) return true;
      if (!disabled) return false;
      if (Array.isArray(disabled)) return disabled.some((dd) => isSameDay(dd, date));
      return disabled(date);
    },
    [min, max, disabled]
  );

  // Day click handler
  const handleDayClick = React.useCallback(
    (day: Date) => {
      if (isDateDisabled(day)) return;

      if (mode === "single") {
        const current = selected as Date | undefined;
        updateSelected(current && isSameDay(current, day) ? undefined : day);
      } else if (mode === "range") {
        const current = selected as DateRange | undefined;
        if (!current || current.to || !current.from) {
          // Start a new range
          updateSelected({ from: day });
        } else {
          // Complete the range
          const from = current.from;
          if (isSameDay(from, day)) {
            updateSelected(undefined);
          } else if (isBefore(day, from)) {
            updateSelected({ from: day, to: from });
          } else {
            updateSelected({ from, to: day });
          }
        }
      } else {
        // multiple
        const current = (selected as Date[] | undefined) ?? [];
        const idx = current.findIndex((d) => isSameDay(d, day));
        if (idx >= 0) {
          updateSelected(current.filter((_, i) => i !== idx));
        } else {
          updateSelected([...current, day]);
        }
      }
    },
    [mode, selected, isDateDisabled, updateSelected]
  );

  return (
    <CalendarContext.Provider
      value={{ month, changeMonth, jumpToMonth, mode, selected, handleDayClick, isDateDisabled, weekStartsOn }}
    >
      <div className={cn("flex flex-col gap-1", className)} {...props}>
        {children}
      </div>
    </CalendarContext.Provider>
  );
}
Calendar.displayName = "Calendar";

/* ── Header ──────────────────────────────────────────────────────── */

interface CalendarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label for the jump-to-today pill. @default "Today" */
  todayLabel?: string;
}

const CalendarHeader = React.forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ todayLabel = "Today", className, ...props }, ref) => {
    const { month, changeMonth, jumpToMonth } = React.useContext(CalendarContext);

    const isCurrentMonth =
      month.getFullYear() === new Date().getFullYear() &&
      month.getMonth() === new Date().getMonth();

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between px-1 py-2", className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all active:scale-90 active:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
          </span>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => jumpToMonth(new Date())}
              className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground transition-all active:scale-95"
            >
              {todayLabel}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all active:scale-90 active:bg-accent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }
);
CalendarHeader.displayName = "CalendarHeader";

/* ── Grid ────────────────────────────────────────────────────────── */

const SWIPE_THRESHOLD = 50;

const springConfig = {
  type: "spring" as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
};

const CalendarGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { month, changeMonth, mode, selected, handleDayClick, isDateDisabled, weekStartsOn } =
    React.useContext(CalendarContext);

  const x = useMotionValue(0);
  const controls = useAnimation();
  const [slideDir, setSlideDir] = React.useState(0);

  const cells = React.useMemo(() => getMonthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const dayLabels = React.useMemo(() => getOrderedDayLabels(weekStartsOn), [weekStartsOn]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      setSlideDir(-1);
      changeMonth(-1);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setSlideDir(1);
      changeMonth(1);
    }
    controls.start({
      x: 0,
      transition: { type: "spring", damping: 30, stiffness: 300 },
    });
  };

  // Selection helpers
  const isSelected = (day: Date): boolean => {
    if (mode === "single") {
      const s = selected as Date | undefined;
      return !!s && isSameDay(s, day);
    }
    if (mode === "range") {
      const r = selected as DateRange | undefined;
      if (!r?.from) return false;
      if (isSameDay(r.from, day)) return true;
      if (r.to && isSameDay(r.to, day)) return true;
      return false;
    }
    // multiple
    const arr = (selected as Date[] | undefined) ?? [];
    return arr.some((d) => isSameDay(d, day));
  };

  const isInRange = (day: Date): boolean => {
    if (mode !== "range") return false;
    const r = selected as DateRange | undefined;
    if (!r?.from || !r.to) return false;
    const t = day.getTime();
    return t > r.from.getTime() && t < r.to.getTime();
  };

  const isRangeStart = (day: Date): boolean => {
    if (mode !== "range") return false;
    const r = selected as DateRange | undefined;
    return !!r?.from && isSameDay(r.from, day) && !!r.to;
  };

  const isRangeEnd = (day: Date): boolean => {
    if (mode !== "range") return false;
    const r = selected as DateRange | undefined;
    return !!r?.to && isSameDay(r.to, day);
  };

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border bg-card overflow-hidden", className)}
      {...props}
    >
      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 px-1 pt-2">
        {dayLabels.map((label) => (
          <span
            key={label}
            className="flex items-center justify-center py-1 text-[11px] font-semibold tracking-wide text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Swipeable month grid */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={controls}
      >
        <AnimatePresence mode="popLayout" custom={slideDir}>
          <motion.div
            key={`${month.getFullYear()}-${month.getMonth()}`}
            initial={{ opacity: 0, x: slideDir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDir * -40 }}
            transition={springConfig}
            className="grid grid-cols-7 gap-y-0.5 px-1 pb-2"
          >
            {cells.map((day, i) => {
              if (!day) {
                return <span key={`empty-${i}`} className="h-10" />;
              }

              const today = isToday(day);
              const sel = isSelected(day);
              const inRange = isInRange(day);
              const rangeStart = isRangeStart(day);
              const rangeEnd = isRangeEnd(day);
              const disabled = isDateDisabled(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "relative flex h-10 items-center justify-center text-sm font-medium transition-colors",
                    disabled && "pointer-events-none opacity-30",
                    !sel && !inRange && !today && "active:bg-accent",
                    inRange && "bg-primary/10",
                    rangeStart && "rounded-l-lg bg-primary/10",
                    rangeEnd && "rounded-r-lg bg-primary/10"
                  )}
                >
                  {/* Selected indicator */}
                  {sel && (
                    <motion.span
                      layoutId="calendarSelected"
                      className="absolute inset-1 rounded-lg bg-foreground"
                      transition={springConfig}
                    />
                  )}

                  {/* Today ring (when not selected) */}
                  {today && !sel && (
                    <span className="absolute inset-1 rounded-lg border-2 border-foreground" />
                  )}

                  <span
                    className={cn(
                      "relative z-10 tabular-nums",
                      sel && "font-bold text-background",
                      today && !sel && "font-bold text-foreground"
                    )}
                  >
                    {day.getDate()}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
});
CalendarGrid.displayName = "CalendarGrid";

/* ── Hook ─────────────────────────────────────────────────────────── */

function useCalendar() {
  return React.useContext(CalendarContext);
}

/* ── Exports ──────────────────────────────────────────────────────── */

export {
  Calendar,
  CalendarHeader,
  CalendarGrid,
  useCalendar,
  isSameDay as calendarIsSameDay,
  type SelectionMode,
  type CalendarBaseProps,
};
