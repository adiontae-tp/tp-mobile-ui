import * as React from "react";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  type Detent,
} from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/* ── Context ──────────────────────────────────────────────────────── */

interface SheetInputContextValue {
  open: boolean;
  dismiss: () => void;
}

const SheetInputContext = React.createContext<SheetInputContextValue>({
  open: false,
  dismiss: () => {},
});

function useSheetInput() {
  return React.useContext(SheetInputContext);
}

/* ── Root ──────────────────────────────────────────────────────────── */

interface SheetInputProps {
  /** Controlled open state. */
  open?: boolean;
  /** Callback when the sheet opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Sheet header title. */
  title?: string;
  /** Sheet header description. */
  description?: string;
  /** Snap detents for the bottom sheet. @default ["content"] */
  detents?: Detent[];
  /** Portal target for contained rendering. */
  container?: HTMLElement | null;
  children: React.ReactNode;
}

function SheetInput({
  open: openProp,
  onOpenChange,
  title,
  description,
  detents = ["content"],
  container,
  children,
}: SheetInputProps) {
  const dismiss = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const ctxValue = React.useMemo<SheetInputContextValue>(
    () => ({ open: openProp ?? false, dismiss }),
    [openProp, dismiss]
  );

  // Separate trigger from sheet body children
  let trigger: React.ReactNode = null;
  const body: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SheetInputTrigger) {
      trigger = child;
    } else {
      body.push(child);
    }
  });

  return (
    <SheetInputContext.Provider value={ctxValue}>
      <BottomSheet
        open={openProp}
        onOpenChange={onOpenChange}
        modal
        container={container}
        detents={detents}
      >
        {trigger}

        <BottomSheetContent>
          {(title || description) && (
            <BottomSheetHeader>
              {title && <BottomSheetTitle>{title}</BottomSheetTitle>}
              {description && (
                <BottomSheetDescription>{description}</BottomSheetDescription>
              )}
            </BottomSheetHeader>
          )}
          {body}
          <div className="h-2" />
        </BottomSheetContent>
      </BottomSheet>
    </SheetInputContext.Provider>
  );
}
SheetInput.displayName = "SheetInput";

/* ── Trigger ──────────────────────────────────────────────────────── */

interface SheetInputTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Display value shown in the input-like trigger. */
  value?: string;
  /** Placeholder when no value is set. */
  placeholder?: string;
  /** Icon shown at the start of the trigger. */
  startIcon?: React.ReactNode;
  /** Icon shown at the end. @default ChevronRight */
  endIcon?: React.ReactNode;
  /** Hide the end icon entirely. */
  hideEndIcon?: boolean;
}

const SheetInputTrigger = React.forwardRef<
  HTMLButtonElement,
  SheetInputTriggerProps
>(
  (
    {
      className,
      value,
      placeholder,
      startIcon,
      endIcon,
      hideEndIcon = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <BottomSheetTrigger
        ref={ref}
        disabled={disabled}
        className={cn(
          "flex h-11 min-h-touch w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-base ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {startIcon && (
          <span className="shrink-0 text-muted-foreground">{startIcon}</span>
        )}
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            hasValue ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {hasValue ? value : placeholder}
        </span>
        {!hideEndIcon && (
          <span className="shrink-0 text-muted-foreground">
            {endIcon ?? <ChevronRight className="h-4 w-4" />}
          </span>
        )}
      </BottomSheetTrigger>
    );
  }
);
SheetInputTrigger.displayName = "SheetInputTrigger";

/* ── Exports ──────────────────────────────────────────────────────── */

export {
  SheetInput,
  SheetInputTrigger,
  useSheetInput,
  type SheetInputProps,
  type SheetInputTriggerProps,
};
