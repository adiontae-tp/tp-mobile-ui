import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Page ────────────────────────────────────────────────────────── */

const Page = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-full flex-col", className)}
      style={{ contain: "layout size style" }}
      {...props}
    />
  )
);
Page.displayName = "Page";

/* ── PageContent ─────────────────────────────────────────────────── */

const PageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div className={cn("relative min-h-0 flex-1 overflow-hidden", className)} {...props}>
      <div ref={ref} className="absolute inset-0 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  )
);
PageContent.displayName = "PageContent";

/* ── PageFooter ──────────────────────────────────────────────────── */

const PageFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative shrink-0", className)}
      {...props}
    />
  )
);
PageFooter.displayName = "PageFooter";

/* ── Exports ─────────────────────────────────────────────────────── */

export { Page, PageContent, PageFooter };
