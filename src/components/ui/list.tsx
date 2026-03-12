import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Search, X } from "lucide-react";

/* ─── Context ─────────────────────────────────────────────────────── */

type ListVariant = "list" | "card" | "card-grid";

const ListContext = React.createContext<ListVariant>("list");

/* ─── List ────────────────────────────────────────────────────────── */

const List = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean;
    variant?: ListVariant;
  }
>(({ className, inset, variant = "list", ...props }, ref) => (
  <ListContext.Provider value={variant}>
    <div
      ref={ref}
      role="list"
      className={cn(
        variant === "list" && "flex flex-col divide-y divide-border",
        variant === "list" && inset && "mx-4 overflow-hidden rounded-lg border",
        variant === "card" && "flex flex-col gap-3 px-4",
        variant === "card-grid" && "grid grid-cols-2 gap-3 px-4",
        className
      )}
      {...props}
    />
  </ListContext.Provider>
));
List.displayName = "List";

/* ─── ListSearch ──────────────────────────────────────────────────── */

interface ListSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onValueChange: (value: string) => void;
}

const ListSearch = React.forwardRef<HTMLInputElement, ListSearchProps>(
  ({ className, value, onValueChange, placeholder = "Search…", ...props }, ref) => (
    <div className={cn("relative mx-4 mb-2 mt-2", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-9 w-full rounded-lg border-none bg-muted px-3 py-2 pl-9 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none"
        autoCapitalize="none"
        autoCorrect="off"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
);
ListSearch.displayName = "ListSearch";

/* ─── ListSection ─────────────────────────────────────────────────── */

interface ListSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  footer?: string;
}

const ListSection = React.forwardRef<HTMLDivElement, ListSectionProps>(
  ({ className, label, footer, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {label && (
        <div className="px-4 pb-1 pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      {children}
      {footer && (
        <div className="px-4 pb-4 pt-1.5 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  )
);
ListSection.displayName = "ListSection";

/* ─── ListHeader (standalone, kept for backward compat) ───────────── */

const ListHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 pb-1 pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      className
    )}
    {...props}
  />
));
ListHeader.displayName = "ListHeader";

/* ─── ListFooter (standalone, kept for backward compat) ───────────── */

const ListFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 pb-4 pt-1.5 text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
));
ListFooter.displayName = "ListFooter";

/* ─── ListItem ────────────────────────────────────────────────────── */

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  pressable?: boolean;
  chevron?: boolean;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, pressable, chevron, children, ...props }, ref) => {
    const variant = React.useContext(ListContext);

    if (variant === "card" || variant === "card-grid") {
      return (
        <div
          ref={ref}
          role="listitem"
          className={cn(
            "flex rounded-lg border bg-card p-3",
            variant === "card" && "flex-row items-center gap-3",
            variant === "card-grid" && "flex-col",
            pressable &&
              "cursor-pointer active:scale-[0.98] transition-transform duration-100",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="listitem"
        className={cn(
          "flex min-h-touch items-center gap-3 bg-card px-4",
          pressable &&
            "cursor-pointer active:bg-accent transition-colors duration-100",
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
        {chevron && (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>
    );
  }
);
ListItem.displayName = "ListItem";

/* ─── ListItemIcon ────────────────────────────────────────────────── */

const ListItemIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground",
      className
    )}
    {...props}
  />
));
ListItemIcon.displayName = "ListItemIcon";

/* ─── ListItemContent ─────────────────────────────────────────────── */

const ListItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 flex-1 flex-col py-3", className)}
    {...props}
  />
));
ListItemContent.displayName = "ListItemContent";

/* ─── ListItemTitle ───────────────────────────────────────────────── */

const ListItemTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("truncate text-sm font-medium", className)}
    {...props}
  />
));
ListItemTitle.displayName = "ListItemTitle";

/* ─── ListItemSubtitle ────────────────────────────────────────────── */

const ListItemSubtitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("truncate text-xs text-muted-foreground", className)}
    {...props}
  />
));
ListItemSubtitle.displayName = "ListItemSubtitle";

/* ─── ListItemAction ──────────────────────────────────────────────── */

const ListItemAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0", className)}
    {...props}
  />
));
ListItemAction.displayName = "ListItemAction";

export {
  List,
  ListSearch,
  ListSection,
  ListHeader,
  ListFooter,
  ListItem,
  ListItemIcon,
  ListItemContent,
  ListItemTitle,
  ListItemSubtitle,
  ListItemAction,
};
