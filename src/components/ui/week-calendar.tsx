import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────── */

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
}

/* ── Helpers ──────────────────────────────────────────────────────── */

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

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

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const DAY_NAMES_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
] as const;

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const sameMonth = weekStart.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} - ${end.getDate()}`;
  }
  return `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} - ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}`;
}

function formatFullDate(date: Date): string {
  return `${DAY_NAMES_FULL[date.getDay()]}, ${MONTH_NAMES_FULL[date.getMonth()]} ${date.getDate()}`;
}

/* ── Context ──────────────────────────────────────────────────────── */

interface WeekCalendarContextValue {
  weekStart: Date;
  events: CalendarEvent[];
  onDayPress?: (date: Date) => void;
  changeWeek: (direction: 1 | -1) => void;
  jumpToWeek: (date: Date) => void;
}

const WeekCalendarContext = React.createContext<WeekCalendarContextValue>({
  weekStart: startOfWeek(new Date()),
  events: [],
  changeWeek: () => {},
  jumpToWeek: () => {},
});

/* ── Root ──────────────────────────────────────────────────────────── */

interface WeekCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled: any date within the week to display. */
  weekOf?: Date;
  /** Default week to display (uncontrolled). */
  defaultWeekOf?: Date;
  /** Callback when a day in the strip is tapped. */
  onDayPress?: (date: Date) => void;
  /** Callback when the displayed week changes via arrows or swipe. */
  onWeekChange?: (weekStart: Date) => void;
  /** Calendar events — used for dot indicators on the strip and event list. */
  events?: CalendarEvent[];
}

function WeekCalendar({
  weekOf,
  defaultWeekOf,
  onDayPress,
  onWeekChange,
  events = [],
  className,
  children,
  ...props
}: WeekCalendarProps) {
  const [internalWeekStart, setInternalWeekStart] = React.useState(() =>
    startOfWeek(defaultWeekOf ?? new Date())
  );

  const isControlled = weekOf !== undefined;
  const weekStart = isControlled ? startOfWeek(weekOf) : internalWeekStart;

  const changeWeek = React.useCallback(
    (direction: 1 | -1) => {
      const next = new Date(weekStart);
      next.setDate(next.getDate() + direction * 7);
      const nextStart = startOfWeek(next);

      if (!isControlled) {
        setInternalWeekStart(nextStart);
      }
      onWeekChange?.(nextStart);
    },
    [weekStart, isControlled, onWeekChange]
  );

  const jumpToWeek = React.useCallback(
    (date: Date) => {
      const target = startOfWeek(date);
      if (!isControlled) {
        setInternalWeekStart(target);
      }
      onWeekChange?.(target);
    },
    [isControlled, onWeekChange]
  );

  return (
    <WeekCalendarContext.Provider
      value={{ weekStart, events, onDayPress, changeWeek, jumpToWeek }}
    >
      <div className={cn("flex flex-col gap-1", className)} {...props}>
        {children}
      </div>
    </WeekCalendarContext.Provider>
  );
}
WeekCalendar.displayName = "WeekCalendar";

/* ── Week Strip ───────────────────────────────────────────────────── */

const SWIPE_THRESHOLD = 50;

const WeekCalendarStrip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { weekStart, events, onDayPress, changeWeek } =
    React.useContext(WeekCalendarContext);
  const days = getWeekDays(weekStart);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [slideDir, setSlideDir] = React.useState(0);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      setSlideDir(-1);
      changeWeek(-1);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setSlideDir(1);
      changeWeek(1);
    }
    controls.start({
      x: 0,
      transition: { type: "spring", damping: 30, stiffness: 300 },
    });
  };

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border bg-card", className)}
      {...props}
    >
      <motion.div
        className="flex items-stretch px-0.5 py-3"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={controls}
      >
        <AnimatePresence mode="popLayout" custom={slideDir}>
          {days.map((day) => {
            const today = isToday(day);
            const hasEvents = events.some((e) => isSameDay(e.date, day));

            return (
              <motion.button
                key={day.toISOString()}
                type="button"
                onClick={() => onDayPress?.(day)}
                initial={{ opacity: 0, x: slideDir * 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDir * -16 }}
                transition={{
                  type: "spring",
                  damping: 28,
                  stiffness: 260,
                  mass: 0.8,
                }}
                className="relative flex w-[calc(100%/7)] flex-col items-center gap-0.5 py-1"
              >
                {/* Day abbreviation */}
                <span className="relative z-10 text-[11px] font-semibold tracking-wide text-muted-foreground">
                  {DAY_ABBR[day.getDay()]}
                </span>

                {/* Day number with today indicator */}
                <span className="relative flex h-9 w-9 items-center justify-center">
                  {today && (
                    <motion.span
                      layoutId="weekCalendarToday"
                      className="absolute inset-0 rounded-lg bg-foreground"
                      transition={{
                        type: "spring",
                        damping: 28,
                        stiffness: 260,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 text-xl font-bold tabular-nums",
                      today ? "text-background" : "text-foreground"
                    )}
                  >
                    {day.getDate()}
                  </span>
                </span>

                {/* Event dot indicator */}
                <span className="flex h-3 items-center justify-center">
                  {hasEvents && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        today ? "bg-background" : "bg-primary"
                      )}
                    />
                  )}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});
WeekCalendarStrip.displayName = "WeekCalendarStrip";

/* ── Week Navigation ──────────────────────────────────────────────── */

interface WeekCalendarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label for the jump-back button when viewing another week. Defaults to "This Week". */
  thisWeekLabel?: string;
}

const WeekCalendarNav = React.forwardRef<HTMLDivElement, WeekCalendarNavProps>(
  ({ thisWeekLabel = "This Week", className, ...props }, ref) => {
    const { weekStart, changeWeek, jumpToWeek } =
      React.useContext(WeekCalendarContext);

    const todayWeekStart = startOfWeek(new Date());
    const isCurrentWeek = isSameDay(weekStart, todayWeekStart);

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between px-1 py-2", className)}
        {...props}
      >
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all active:scale-90 active:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {formatWeekRange(weekStart)}
          </span>
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={() => jumpToWeek(new Date())}
              className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground transition-all active:scale-95"
            >
              {thisWeekLabel}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => changeWeek(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-all active:scale-90 active:bg-accent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }
);
WeekCalendarNav.displayName = "WeekCalendarNav";

/* ── Event Card ───────────────────────────────────────────────────── */

interface WeekCalendarEventProps extends React.HTMLAttributes<HTMLDivElement> {
  event: CalendarEvent;
  /** Callback when the event card is tapped. */
  onEventClick?: (event: CalendarEvent) => void;
  /** Show a menu button on the right. */
  onMenuClick?: (event: CalendarEvent) => void;
}

const WeekCalendarEvent = React.forwardRef<
  HTMLDivElement,
  WeekCalendarEventProps
>(({ event, onEventClick, onMenuClick, className, ...props }, ref) => {
  const dayAbbr = DAY_ABBR[event.date.getDay()];
  const dayNum = event.date.getDate();
  const fullDate = formatFullDate(event.date);

  const timeStr = [event.startTime, event.endTime]
    .filter(Boolean)
    .join(" - ");
  const subtitle = [timeStr, event.duration ? `(${event.duration})` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      role={onEventClick ? "button" : undefined}
      tabIndex={onEventClick ? 0 : undefined}
      onClick={onEventClick ? () => onEventClick(event) : undefined}
      className={cn(
        "flex items-center gap-3.5 rounded-2xl border bg-card p-3.5",
        onEventClick && "cursor-pointer transition-colors active:bg-accent/50",
        className
      )}
      {...props}
    >
      {/* Day badge */}
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-foreground">
        <span className="text-[10px] font-bold uppercase leading-none tracking-wider text-background">
          {dayAbbr}
        </span>
        <span className="mt-0.5 text-xl font-bold leading-none text-background">
          {dayNum}
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {event.title || fullDate}
        </p>
        {subtitle && (
          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* Menu */}
      {onMenuClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick(event);
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-accent"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
WeekCalendarEvent.displayName = "WeekCalendarEvent";

/* ── Day Events List ──────────────────────────────────────────────── */

interface WeekCalendarDayEventsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Filter to a specific day. If omitted, shows all events for the displayed week. */
  date?: Date;
  /** Render function for each event. Falls back to WeekCalendarEvent. */
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
  /** Callback when an event card is tapped. */
  onEventClick?: (event: CalendarEvent) => void;
  /** Callback for event menu button clicks. */
  onEventMenuClick?: (event: CalendarEvent) => void;
  /** Content to display when there are no events. */
  emptyContent?: React.ReactNode;
}

function isInWeek(date: Date, weekStart: Date): boolean {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

const WeekCalendarDayEvents = React.forwardRef<
  HTMLDivElement,
  WeekCalendarDayEventsProps
>(
  (
    {
      date,
      renderEvent,
      onEventClick,
      onEventMenuClick,
      emptyContent,
      className,
      ...props
    },
    ref
  ) => {
    const { events, weekStart } = React.useContext(WeekCalendarContext);

    const filteredEvents = React.useMemo(() => {
      const list = date
        ? events.filter((e) => isSameDay(e.date, date))
        : events.filter((e) => isInWeek(e.date, weekStart));

      // Sort by date, then by startTime
      return list.sort((a, b) => {
        const dateDiff = a.date.getTime() - b.date.getTime();
        if (dateDiff !== 0) return dateDiff;
        return (a.startTime ?? "").localeCompare(b.startTime ?? "");
      });
    }, [events, date, weekStart]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0
            ? filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                >
                  {renderEvent ? (
                    renderEvent(event)
                  ) : (
                    <WeekCalendarEvent
                      event={event}
                      onEventClick={onEventClick}
                      onMenuClick={onEventMenuClick}
                    />
                  )}
                </motion.div>
              ))
            : emptyContent && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {emptyContent}
                </motion.div>
              )}
        </AnimatePresence>
      </div>
    );
  }
);
WeekCalendarDayEvents.displayName = "WeekCalendarDayEvents";

/* ── Hook ─────────────────────────────────────────────────────────── */

function useWeekCalendar() {
  return React.useContext(WeekCalendarContext);
}

/* ── Exports ──────────────────────────────────────────────────────── */

export {
  WeekCalendar,
  WeekCalendarStrip,
  WeekCalendarNav,
  WeekCalendarEvent,
  WeekCalendarDayEvents,
  useWeekCalendar,
  formatFullDate,
  isSameDay,
};
