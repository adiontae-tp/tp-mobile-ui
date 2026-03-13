import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Context ──────────────────────────────────────────────────────── */

interface BottomTabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const BottomTabsContext = React.createContext<BottomTabsContextValue>({
  value: "",
  onValueChange: () => {},
});

/* ── Root ──────────────────────────────────────────────────────────── */

interface BottomTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The controlled active tab value. */
  value?: string;
  /** Callback when the active tab changes. */
  onValueChange?: (value: string) => void;
  /** The default active tab value (uncontrolled). */
  defaultValue?: string;
}

/**
 * Context provider for bottom tab state. Does not impose layout — use
 * inside a Page with PageContent / PageFooter to position the bar.
 */
function BottomTabs({
  value,
  onValueChange,
  defaultValue = "",
  className,
  children,
  ...props
}: BottomTabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const handleChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  return (
    <BottomTabsContext.Provider
      value={{ value: activeValue, onValueChange: handleChange }}
    >
      <div className={cn("contents", className)} {...props}>
        {children}
      </div>
    </BottomTabsContext.Provider>
  );
}
BottomTabs.displayName = "BottomTabs";

/* ── Bar (bottom tab bar) ─────────────────────────────────────────── */

interface BottomTabsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Background color that fills the bar and the safe-area below it.
   *  Accepts any CSS color value. When set, replaces the default
   *  translucent background. */
  fill?: string;
}

const BottomTabsBar = React.forwardRef<HTMLDivElement, BottomTabsBarProps>(
  ({ fill, className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "flex shrink-0 items-end justify-around border-t",
        !fill && "bg-background/80 backdrop-blur-xl",
        "pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))]",
        className
      )}
      style={fill ? { backgroundColor: fill, ...style } : style}
      {...props}
    />
  )
);
BottomTabsBar.displayName = "BottomTabsBar";

/* ── Content (tab panel) ─────────────────────────────────────────── */

interface BottomTabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show this content when the matching value is active. */
  value: string;
}

function BottomTabsContent({
  value,
  className,
  children,
  ...props
}: BottomTabsContentProps) {
  const { value: activeValue } = React.useContext(BottomTabsContext);
  if (activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
BottomTabsContent.displayName = "BottomTabsContent";

/* ── Tab (individual tab button) ──────────────────────────────────── */

interface BottomTabsTabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** The value that identifies this tab. */
  value: string;
  /** Icon element rendered above the label. */
  icon: React.ReactNode;
  /** Text label below the icon. */
  label: string;
  /** Show a notification badge. `true` for a dot, or a number/string for a count. */
  badge?: boolean | number | string;
}

const BottomTabsTab = React.forwardRef<HTMLButtonElement, BottomTabsTabProps>(
  ({ value, icon, label, badge, className, ...props }, ref) => {
    const { value: activeValue, onValueChange } =
      React.useContext(BottomTabsContext);
    const isActive = activeValue === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        className={cn(
          "relative flex min-h-touch min-w-[3.5rem] flex-col items-center justify-center gap-0.5 px-1 pt-1.5 pb-1 text-muted-foreground transition-colors",
          isActive && "text-primary",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {/* Icon container */}
        <span className="relative flex h-6 w-6 items-center justify-center">
          {/* Active pill indicator behind the icon */}
          {isActive && (
            <motion.span
              layoutId="bottomTabIndicator"
              className="absolute -inset-x-2.5 -inset-y-0.5 rounded-full bg-primary/10"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
          )}
          <span className="relative z-10 flex h-5 w-5 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>

          {/* Badge */}
          {badge !== undefined && badge !== false && (
            <span
              className={cn(
                "absolute z-20 flex items-center justify-center rounded-full bg-destructive font-semibold text-destructive-foreground",
                badge === true
                  ? "-right-0.5 -top-0.5 h-2 w-2"
                  : "-right-2.5 -top-1.5 min-w-[1.125rem] h-[1.125rem] px-1 text-[10px] leading-none"
              )}
            >
              {badge !== true && badge}
            </span>
          )}
        </span>

        {/* Label */}
        <span
          className={cn(
            "text-[10px] leading-tight transition-colors",
            isActive ? "font-semibold" : "font-medium"
          )}
        >
          {label}
        </span>
      </button>
    );
  }
);
BottomTabsTab.displayName = "BottomTabsTab";

export { BottomTabs, BottomTabsBar, BottomTabsContent, BottomTabsTab };
