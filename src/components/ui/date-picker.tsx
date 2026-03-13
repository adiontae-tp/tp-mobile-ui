import * as React from "react";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet";
import {
  Calendar,
  CalendarHeader,
  CalendarGrid,
  type CalendarProps,
  type DateRange,
} from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/* ── Context ──────────────────────────────────────────────────────── */

interface DatePickerContextValue {
  open: boolean;
  dismiss: () => void;
}

const DatePickerContext = React.createContext<DatePickerContextValue>({
  open: false,
  dismiss: () => {},
});

function useDatePicker() {
  return React.useContext(DatePickerContext);
}

/* ── Root ──────────────────────────────────────────────────────────── */

interface DatePickerBaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sheet header title. */
  title?: string;
  /** Confirm button label (range/multiple modes). @default "Done" */
  confirmLabel?: string;
  /** Clear button label. @default "Clear" */
  clearLabel?: string;
  /** Auto-close when a date is selected in single mode. @default true */
  closeOnSelect?: boolean;
  /** Portal target. */
  container?: HTMLElement | null;
  children: React.ReactNode;
}

interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single";
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
  min?: Date;
  max?: Date;
  disabled?: Date[] | ((date: Date) => boolean);
}

interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  selected?: DateRange;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  min?: Date;
  max?: Date;
  disabled?: Date[] | ((date: Date) => boolean);
}

interface DatePickerMultipleProps extends DatePickerBaseProps {
  mode: "multiple";
  selected?: Date[];
  defaultSelected?: Date[];
  onSelect?: (dates: Date[]) => void;
  min?: Date;
  max?: Date;
  disabled?: Date[] | ((date: Date) => boolean);
}

export type DatePickerProps =
  | DatePickerSingleProps
  | DatePickerRangeProps
  | DatePickerMultipleProps;

function DatePicker({
  open: openProp,
  onOpenChange,
  mode = "single",
  selected,
  defaultSelected,
  onSelect,
  min,
  max,
  disabled,
  title,
  confirmLabel = "Done",
  clearLabel = "Clear",
  closeOnSelect = true,
  container,
  children,
}: DatePickerProps) {
  // Internal state for pending selection in range/multiple modes
  const [pendingSelected, setPendingSelected] = React.useState<
    DateRange | undefined | Date[] | undefined
  >(undefined);

  const needsConfirm = mode === "range" || mode === "multiple";

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) setPendingSelected(undefined);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const dismiss = React.useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Intercept selection for auto-close and pending logic
  const handleSelect = React.useCallback(
    (value: unknown) => {
      if (needsConfirm) {
        setPendingSelected(value as DateRange | Date[]);
      } else {
        (onSelect as ((v: unknown) => void) | undefined)?.(value);
        if (closeOnSelect && value !== undefined) {
          // Small delay so the user sees the selection feedback
          setTimeout(() => dismiss(), 150);
        }
      }
    },
    [needsConfirm, onSelect, closeOnSelect, dismiss]
  );

  const handleConfirm = React.useCallback(() => {
    if (pendingSelected !== undefined) {
      (onSelect as ((v: unknown) => void) | undefined)?.(pendingSelected);
    }
    dismiss();
  }, [pendingSelected, onSelect, dismiss]);

  const handleClear = React.useCallback(() => {
    if (mode === "multiple") {
      setPendingSelected([]);
      (onSelect as ((v: unknown) => void) | undefined)?.([]);
    } else {
      setPendingSelected(undefined);
      (onSelect as ((v: unknown) => void) | undefined)?.(undefined);
    }
    dismiss();
  }, [mode, onSelect, dismiss]);

  // Build calendar props
  const calendarProps = {
    mode,
    selected: needsConfirm ? (pendingSelected ?? selected) : selected,
    defaultSelected,
    onSelect: handleSelect,
    min,
    max,
    disabled,
  } as CalendarProps;

  return (
    <DatePickerContext.Provider value={{ open: openProp ?? false, dismiss }}>
      <BottomSheet
        open={openProp}
        onOpenChange={handleOpenChange}
        modal
        container={container}
        detents={["content"]}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === DatePickerTrigger) {
            return child;
          }
          return null;
        })}

        <BottomSheetContent>
          {title && (
            <>
              <BottomSheetHeader>
                <BottomSheetTitle>{title}</BottomSheetTitle>
              </BottomSheetHeader>
            </>
          )}

          <Calendar {...calendarProps}>
            <CalendarHeader />
            <CalendarGrid />
          </Calendar>

          {needsConfirm && (
            <>
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
            </>
          )}
          <div className="h-2" />
        </BottomSheetContent>
      </BottomSheet>
    </DatePickerContext.Provider>
  );
}
DatePicker.displayName = "DatePicker";

/* ── Trigger ──────────────────────────────────────────────────────── */

const DatePickerTrigger = BottomSheetTrigger;
DatePickerTrigger.displayName = "DatePickerTrigger";

/* ── Exports ──────────────────────────────────────────────────────── */

export {
  DatePicker,
  DatePickerTrigger,
  useDatePicker,
  type DatePickerBaseProps,
};
